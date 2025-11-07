import {
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { ModalService } from '../services/modal';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthResponse } from '../models/auth';

// --- Refresh Token State ---
// Flag to check if a token refresh is already in progress.
let isRefreshing = false;
// Subject to hold the new token. Other requests will wait on this.
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

/**
 * Intercepts outgoing HTTP requests to add the Authorization token.
 * Intercepts incoming 401 errors to automatically handle token refreshing.
 * If refreshing fails, it triggers the session expired modal.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);
  const authToken = authService.getAuthToken();

  // 1. Clone the request and add the token if it exists
  let authReq = req;
  if (authToken) {
    authReq = addTokenToRequest(req, authToken);
  }

  // 2. Send the request and handle errors
  return next(authReq).pipe(
    catchError((error) => {
      // Check if it's an HTTP 401 error
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // 3. If the 401 error is from LOGIN, REGISTER, REFRESH or CHANGE_PASSWORD endpoints,
        //    do NOT attempt to refresh the token. Just let the error pass through
        //    to be handled by the component's .catchError()
        if (
          req.url.includes(API_ENDPOINTS.AUTH.LOGIN) ||
          req.url.includes(API_ENDPOINTS.AUTH.REGISTER) ||
          req.url.includes(API_ENDPOINTS.AUTH.REFRESH) ||
          req.url.includes(API_ENDPOINTS.USERS.CHANGE_PASSWORD)
        ) {
          // If it was the REFRESH endpoint itself that failed, trigger the modal
          if (req.url.includes(API_ENDPOINTS.AUTH.REFRESH)) {
            isRefreshing = false; // Reset flag just in case
            modalService.showSessionExpiredModal();
          }
          // For LOGIN and REGISTER, just re-throw the error (e.g., "Invalid credentials")
          return throwError(() => error);
        }

        // 4. Handle the 401 error: Try to refresh
        return handle401Error(authReq, next, authService, modalService);
      }

      // If it's not a 401, just re-throw the error
      return throwError(() => error);
    })
  ) as Observable<HttpEvent<unknown>>;
};

/**
 * Helper function to clone a request and add the Authorization header.
 * @param req The original request.
 * @param token The JWT token.
 * @returns A new request with the Authorization header.
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
}

/**
 * Handles the 401 error by attempting to refresh the token.
 * Manages the isRefreshing flag to prevent multiple refresh attempts.
 * @param req The request that failed with 401.
 * @param next The HttpHandlerFn to continue the chain.
 * @param authService The AuthService to perform the refresh.
 * @param modalService The ModalService to show expiration.
 * @returns An observable of the HTTP event.
 */
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  modalService: ModalService
): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    // 5. If a refresh is already in progress, wait for the new token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null), // Wait until the subject has a new token
      take(1), // Take only one emission
      switchMap((jwtToken) => {
        // Retry the original request with the new token
        return next(addTokenToRequest(req, jwtToken!));
      })
    );
  } else {
    // 6. This is the first 401, so start the refresh process
    isRefreshing = true;
    refreshTokenSubject.next(null); // Block other requests

    return authService.refreshToken().pipe(
      switchMap((authResponse: AuthResponse) => {
        // 7. REFRESH SUCCESSFUL
        isRefreshing = false;
        refreshTokenSubject.next(authResponse.token); // Emit the new token to waiting requests

        // Retry the original request with the new token
        return next(addTokenToRequest(req, authResponse.token));
      }),
      catchError((refreshError) => {
        // 8. REFRESH FAILED (e.g., refresh token is also expired)
        isRefreshing = false;

        // --- TRIGGER THE MODAL ---
        // The refresh token is invalid. Log out the user (locally)
        // and show the "session expired" modal.
        modalService.showSessionExpiredModal();

        // Stop the request chain
        return throwError(() => refreshError);
      })
    );
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Router } from '@angular/router';
import { User, UserProfile } from '../../models/user';
import { AuthProvider, AuthRequest, AuthResponse, SignupRequest } from '../../models/auth';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

const USER_KEY = 'current-user';
const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiService = inject(Api);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);

  // Expose a readonly version of the signal to prevent outside modification
  public currentuser = this.currentUserSignal.asReadonly();

  constructor() {
    // Initialize the signal's state from storage
    const user = this.loadUserFromStorage();
    this.currentUserSignal.set(user);
  }

  /**
   * Retrieves the auth token from storage.
   * Checks both localStorage and sessionStorage. Used by the AuthInterceptor.
   */
  public getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Authenticates a user with credentials (email/password).
   * @param request The authentication request payload.
   * @param rememberMe Determines whether to use localStorage (true) or sessionStorage (false).
   */
  public login(request: AuthRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>('/auth', request)
      .pipe(tap((response) => this.setSession(response, rememberMe)));
  }

  /**
   * Registers a new user.
   * @param request The signup request payload.
   * @param rememberMe Determines storage type for the subsequent session.
   */
  public register(request: SignupRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    return this.apiService
      .post<AuthResponse>('/auth/register', request)
      .pipe(tap((response) => this.setSession(response, rememberMe)));
  }

  /**
   * Establishes a user session from tokens received via OAuth2 redirect.
   * Decodes the JWT to get user info. Assumes persistent storage (localStorage).
   * @param token The JWT access token.
   * @param refreshToken The refresh token.
   */
  public setSessionFromOAuth(token: string, refreshToken: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      const authResponse: AuthResponse = {
        token,
        refreshToken,
        id: decodedToken.id,
        username: decodedToken.sub,
        email: decodedToken.email,
      };
      this.setSession(authResponse, true);
    } catch (error) {
      console.error('Failed to decode token from OAuth callback', error);
    }
  }

  /**
   * Clears the user session from both storage types and updates the app state.
   */
  public logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Saves session information to the chosen storage and updates the signal.
   * @param authResponse The response object from the authentication API.
   * @param rememberMe If true, uses localStorage; otherwise, uses sessionStorage.
   */
  private setSession(authResponse: AuthResponse, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.clear();
    sessionStorage.clear();

    const userProfile: UserProfile = {
      userId: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      active: true,
      provider: AuthProvider.LOCAL,
      roles: ['ROLE_USER'],
      permissions: ['READ'],
    };

    // Save the structured user profile to the selected storage
    storage.setItem(USER_KEY, JSON.stringify(userProfile));
    storage.setItem(TOKEN_KEY, authResponse.token);
    storage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);

    // Broadcast the new user profile state
    this.currentUserSignal.set(userProfile);
  }

  /**
   * Loads the user data from storage upon service initialization.
   */
  private loadUserFromStorage(): UserProfile | null {
    let userJson = localStorage.getItem(USER_KEY);
    if (!userJson) {
      userJson = sessionStorage.getItem(USER_KEY);
    }
    // Type assertion to ensure the parsed object matches UserProfile
    return userJson ? (JSON.parse(userJson) as UserProfile) : null;
  }
}

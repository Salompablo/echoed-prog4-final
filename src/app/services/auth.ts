import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api';
import { Router } from '@angular/router';
import { FullUserProfile, UserProfile } from '../models/user';
import { AuthProvider, AuthRequest, AuthResponse, SignupRequest } from '../models/auth';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ToastService } from './toast';

const USER_KEY = 'current-user';
const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private currentUserSignal = signal<UserProfile | null>(null);

  // Expose a readonly version of the signal to prevent outside modification
  public currentUser = this.currentUserSignal.asReadonly();

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
    return this.apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, request).pipe(
      tap((response) => {
        const profile = this.buildUserProfileFromLocal(response);
        this.saveSession(profile, response.token, response.refreshToken, rememberMe);
      })
    );
  }

  /**
   * Registers a new user.
   * @param request The signup request payload.
   * @param rememberMe Determines storage type for the subsequent session.
   */
  public register(request: SignupRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, request).pipe(
      tap((response) => {
        const profile = this.buildUserProfileFromLocal(response);
        this.saveSession(profile, response.token, response.refreshToken, rememberMe);
      })
    );
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
      const userProfile = this.buildUserProfileFromOAuth(decodedToken);
      this.saveSession(userProfile, token, refreshToken, true);
    } catch (error) {
      console.error('Failed to decode token from OAuth callback', error);
    }
  }

  /**
   * Clears the user session from both storage types and updates the app state.
   */
  public logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    sessionStorage.clear();

    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Saves session information to the chosen storage and updates the signal.
   * @param profile The user profile object to save.
   * @param token The JWT access token.
   * @param refreshToken The JWT refresh token.
   * @param rememberMe If true, uses localStorage; otherwise, uses sessionStorage.
   */
  private saveSession(
    profile: UserProfile,
    token: string,
    refreshToken: string,
    rememberMe: boolean
  ): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.clear();

    storage.setItem(USER_KEY, JSON.stringify(profile));
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    this.currentUserSignal.set(profile);
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

  /**
   * Updates the locally stored user profile information (localStorage/sessionStorage and signal).
   * Use this after successfully updating the profile on the backend.
   * @param updatedProfile The user profile data object with the latest information.
   * Could be FullUserProfile or just UserProfile depending on what you have.
   */
  public updateLocalUser(updatedProfileData: Partial<UserProfile | FullUserProfile>): void {
    const currentSessionUser = this.currentUserSignal();
    if (!currentSessionUser) {
      console.warn('Cannot update local user, no user is currently logged in.');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentSessionUser,
      username: updatedProfileData.username ?? currentSessionUser.username,
      profilePictureUrl:
        'profilePictureUrl' in updatedProfileData
          ? updatedProfileData.profilePictureUrl
          : currentSessionUser.profilePictureUrl,
      biography:
        'biography' in updatedProfileData
          ? updatedProfileData.biography
          : currentSessionUser.biography,
    };

    let storageToUpdate: Storage | null = null;
    if (localStorage.getItem(USER_KEY)) {
      storageToUpdate = localStorage;
    } else if (sessionStorage.getItem(USER_KEY)) {
      storageToUpdate = sessionStorage;
    }

    if (storageToUpdate) {
      storageToUpdate.setItem(USER_KEY, JSON.stringify(updatedUser));
      this.currentUserSignal.set(updatedUser);
    
    } else {
      this.toastService.warning(
        'Could not determine storage type (localStorage/sessionStorage) to update user profile.'
      );
      this.currentUserSignal.set(updatedUser);
    }
  }

  /**
   * Builds a UserProfile for a local (email/password) authentication flow.
   * It maps the fields, roles, and permissions from the
   * API's AuthResponse to the local UserProfile model.
   *
   * @param authResponse The response object from the local auth API.
   * @returns A new UserProfile object with the provider set to LOCAL.
   */
  private buildUserProfileFromLocal(authResponse: AuthResponse): UserProfile {
    return {
      userId: authResponse.id,
      username: authResponse.username,
      email: authResponse.email,
      active: true,
      provider: AuthProvider.LOCAL,
      roles: authResponse.roles,
      permissions: authResponse.permissions,
    };
  }

  /**
   * Builds a UserProfile for an OAuth (Google) authentication flow.
   * It maps the claims (e.g., `sub`, `email`, `roles`) from the
   * decoded JWT payload to the local UserProfile model.
   *
   * @param decodedToken The decoded payload from the JWT.
   * @returns A new UserProfile object with the provider set to GOOGLE.
   */
  private buildUserProfileFromOAuth(decodedToken: any): UserProfile {
    return {
      userId: decodedToken.userId,
      username: decodedToken.sub,
      email: decodedToken.email,
      active: true,
      provider: AuthProvider.GOOGLE,
      roles: decodedToken.roles || [],
      permissions: decodedToken.permissions || [],
    };
  }
}

import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { FullUserProfile, UpdateUserProfileRequest } from '../models/user';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AuthResponse } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);

  /**
   * Fetches the profile for the currently logged-in user.
   */
  getCurrentUserProfile(): Observable<FullUserProfile> {
    return this.apiService.get<FullUserProfile>(API_ENDPOINTS.USERS.ME);
  }

  /**
   * Fetches a user profile by username.
   * @param username - The username to get
   */
  getUserProfileByUsername(username: string): Observable<FullUserProfile> {
    return this.apiService.get<FullUserProfile>(API_ENDPOINTS.USERS.BY_USERNAME(username));
  }

  /**
   * Updates the profile (picture, bio) for a given user ID.
   * @param userId - The ID of the user to update.
   * @param data - The data to update (picture URL, biography).
   */
  updateUserProfile(userId: number, data: UpdateUserProfileRequest): Observable<FullUserProfile> {
    return this.apiService.put<FullUserProfile>(API_ENDPOINTS.USERS.UPDATE(userId), data);
  }

  /**
   * Sends username chosen for OAuth profile.
   * @param username The username chosen by the user
   * @returns an Observable with the new AuthResponse (including the refreshed token).
   */
  completeProfile(username: string): Observable<AuthResponse> {
    const request = { username };
    return this.apiService.post<AuthResponse>(API_ENDPOINTS.USERS.COMPLETE_PROFILE, request);
  }
}

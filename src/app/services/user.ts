import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { FullUserProfile, UpdateUserProfileRequest } from '../models/user';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { PagedResponse } from '../models/api';
import { AlbumReviewResponse, SongReviewResponse } from '../models/interaction';
import { AuthResponse, PasswordUpdateRequest } from '../models/auth';

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
   * Fetches a user profile by userId.
   * @param userId -
   */
  getUserProfileByUserId(userId: number): Observable<FullUserProfile> {
    return this.apiService.get<FullUserProfile>(API_ENDPOINTS.USERS.BY_USERID(userId));
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
   * Calls the backend to deactivate the current user's account.
   * Requires the user's current password for verification.
   * @param password The user's current password.
   * @returns Observable<void>
   */
  deactivateAccount(password: string): Observable<void> {
    const request = { password };
    return this.apiService.post<void>(API_ENDPOINTS.USERS.DEACTIVATE, request);
  }

  /**
   * Calls the backend to reactivate a user's account.
   * This is a public endpoint and does not require an auth token.
   * @param userId The ID of the user to reactivate.
   * @returns Observable<void>
   */
  reactivateAccount(userId: number | string): Observable<void> {
    return this.apiService.put<void>(API_ENDPOINTS.USERS.REACTIVATE(userId), {});
  }

  /**
   * Bans a user by their ID.
   * @param userId The ID of the user to ban.
   * @returns An Observable that completes when the operation succeeds.
   */
  banUser(userId: number | string): Observable<void> {
    return this.apiService.post<void>(API_ENDPOINTS.USERS.BAN(userId), {});
  }

  /**
   * Unbans a user by their ID.
   * @param userId The ID of the user to unban.
   * @returns An Observable that completes when the operation succeeds.
   */
  unbanUser(userId: number | string): Observable<void> {
    return this.apiService.post<void>(API_ENDPOINTS.USERS.UNBAN(userId), {});
  }

  /**
   * Calls the backend to change the user's password.
   * This requires the current password for verification.
   * @param request The password update payload
   * @returns Observable<void>
   */
  changePassword(request: PasswordUpdateRequest): Observable<void> {
    return this.apiService.put<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, request);
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


  /**
   * Fetches a paginated list of song reviews for a specific user ID.
   * @param userId - The ID of the user.
   * @param pageNumber - The page number (0-indexed).
   * @param size - The number of reviews per page.
   * @param sort - Optional sort parameter (defaults to 'date').
   */
  getUserSongReviewsById(
    userId: number,
    pageNumber: number,
    size: number,
    sort: string = 'date'
  ): Observable<PagedResponse<SongReviewResponse>> {
    const endpoint = API_ENDPOINTS.USERS.USER_SONG_REVIEWS(userId, pageNumber, size, sort);
    return this.apiService.get<PagedResponse<SongReviewResponse>>(endpoint);
  }

  /**
   * Fetches a paginated list of album reviews for a specific user ID.
   * @param userId - The ID of the user.
   * @param pageNumber - The page number (0-indexed).
   * @param size - The number of reviews per page.
   * @param sort - Optional sort parameter (defaults to 'date').
   */
  getUserAlbumReviewsById(
    userId: number,
    pageNumber: number,
    size: number,
    sort: string = 'date'
  ): Observable<PagedResponse<AlbumReviewResponse>> {
    const endpoint = API_ENDPOINTS.USERS.USER_ALBUM_REVIEWS(userId, pageNumber, size, sort);
    return this.apiService.get<PagedResponse<AlbumReviewResponse>>(endpoint);
  }

  /**
   * Fetches all users with pagination and sorting for admin dashboard.
   * @param query - Search query string
   * @param page - Page number (0-indexed)
   * @param size - Number of users per page
   * @param sort - Sort property
   * @param direction - Sort direction ('asc' or 'desc')
   */
  getAllUsers(
    query: string = '',
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Observable<PagedResponse<FullUserProfile>> {
    const endpoint = `${API_ENDPOINTS.USERS.ALL}?query=${query}&page=${page}&size=${size}&sort=${sort},${direction}`;
    return this.apiService.get<PagedResponse<FullUserProfile>>(endpoint);
  }
}

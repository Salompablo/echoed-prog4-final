import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { FullUserProfile, UpdateUserProfileRequest } from '../models/user';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { PagedResponse } from '../models/api';
import { AlbumReviewResponse, SongReviewResponse } from '../models/interaction';

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
}

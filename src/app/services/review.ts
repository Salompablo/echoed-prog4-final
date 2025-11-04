import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  SongReviewRequest,
  SongReviewResponse,
  AlbumReviewRequest,
  AlbumReviewResponse,
  UpdateSongReviewRequest,
  UpdateAlbumReviewRequest,
} from '../models/interaction';
import { PagedResponse } from '../models/api';

/**
 * @class ReviewService
 * @description Service for managing song and album reviews.
 * Handles full CRUD operations for both song and album reviews.
 */
@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private api = inject(ApiService);

  // ==================== SONG REVIEW METHODS ====================

  /**
   * Retrieves all song reviews (paginated).
   * GET /api/v1/songreviews
   */
  getAllSongReviews(
    page: number = 0,
    size: number = 20,
    sort: string = 'date'
  ): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_ALL_SONG_REVIEWS}?pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Gets a specific song review by ID.
   * GET /api/v1/songreviews/{id}
   */
  getSongReviewById(id: number): Observable<SongReviewResponse> {
    return this.api.get<SongReviewResponse>(API_ENDPOINTS.REVIEWS.GET_SONG_REVIEW_BY_ID(id));
  }

  /**
   * Creates a new song review.
   * POST /api/v1/songreviews
   */
  createSongReview(spotifyId: string, request: SongReviewRequest): Observable<SongReviewResponse> {
    return this.api.post<SongReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.CREATE_SONG_REVIEW}?spotifyId=${spotifyId}`,
      request
    );
  }

  /**
   * Gets all song reviews by a specific user.
   * GET /api/v1/songreviews/user/{userId}
   */
  getSongReviewsByUser(
    userId: number,
    page: number = 0,
    size: number = 20,
    sort: string = 'date'
  ): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_SONG_REVIEWS_BY_USER(userId)}?pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Gets all reviews for a specific song (by spotifyId).
   * GET /api/v1/songreviews/songs
   */
  getSongReviewsByMusic(
    spotifyId: string,
    page: number = 0,
    size: number = 100,
    sort: string = 'date'
  ): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_SONG_REVIEWS_BY_MUSIC}?spotifyId=${spotifyId}&pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Deletes a song review (logical delete).
   * DELETE /api/v1/songreviews/delete/{reviewId}
   */
  deleteSongReview(reviewId: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REVIEWS.DELETE_SONG_REVIEW(reviewId));
  }

  /**
   * Updates a song review's content.
   * PATCH /api/v1/songreviews/{songReviewId}
   */
  updateSongReview(
    songReviewId: number,
    request: UpdateSongReviewRequest
  ): Observable<SongReviewResponse> {
    return this.api.patch<SongReviewResponse>(
      API_ENDPOINTS.REVIEWS.UPDATE_SONG_REVIEW(songReviewId),
      request
    );
  }

  // ==================== ALBUM REVIEW METHODS ====================

  /**
   * Retrieves all album reviews (paginated).
   * GET /api/v1/albumreviews
   */
  getAllAlbumReviews(
    page: number = 0,
    size: number = 20,
    sort: string = 'date'
  ): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_ALL_ALBUM_REVIEWS}?pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Gets a specific album review by ID.
   * GET /api/v1/albumreviews/{id}
   */
  getAlbumReviewById(id: number): Observable<AlbumReviewResponse> {
    return this.api.get<AlbumReviewResponse>(API_ENDPOINTS.REVIEWS.GET_ALBUM_REVIEW_BY_ID(id));
  }

  /**
   * Creates a new album review.
   * POST /api/v1/albumreviews
   */
  createAlbumReview(
    spotifyId: string,
    request: AlbumReviewRequest
  ): Observable<AlbumReviewResponse> {
    return this.api.post<AlbumReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.CREATE_ALBUM_REVIEW}?spotifyId=${spotifyId}`,
      request
    );
  }

  /**
   * Gets album reviews by a specific user.
   * GET /api/v1/albumreviews/user/{userId}
   */
  getAlbumReviewsByUser(
    userId: number,
    page: number = 0,
    size: number = 20,
    sort: string = 'date'
  ): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_ALBUM_REVIEWS_BY_USER(userId)}?pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Gets all reviews for a specific album (by spotifyId).
   * GET /api/v1/albumreviews/albums
   */
  getAlbumReviewsByMusic(
    spotifyId: string,
    page: number = 0,
    size: number = 100,
    sort: string = 'date'
  ): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_ALBUM_REVIEWS_BY_MUSIC}?spotifyId=${spotifyId}&pageNumber=${page}&size=${size}&sort=${sort}`
    );
  }

  /**
   * Deletes an album review (logical delete).
   * DELETE /api/v1/albumreviews/delete/{reviewId}
   */
  deleteAlbumReview(reviewId: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REVIEWS.DELETE_ALBUM_REVIEW(reviewId));
  }

  /**
   * Updates an album review's content.
   * PATCH /api/v1/albumreviews/{albumReviewId}
   */
  updateAlbumReview(
    albumReviewId: number,
    request: UpdateAlbumReviewRequest
  ): Observable<AlbumReviewResponse> {
    return this.api.patch<AlbumReviewResponse>(
      API_ENDPOINTS.REVIEWS.UPDATE_ALBUM_REVIEW(albumReviewId),
      request
    );
  }

  /**
   * Fetches all song reviews from all users.
   * @param size Number of reviews to fetch
   * @returns Observable containing a paged response of all song reviews sorted by date
   */
  getAllSongReviews(size: number = 50): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.SONG_REVIEWS}?size=${size}&pageNumber=0&sort=date`
    );
  }

  /**
   * Fetches all album reviews from all users.
   * @param size Number of reviews to fetch
   * @returns Observable containing a paged response of all album reviews sorted by date
   */
  getAllAlbumReviews(size: number = 50): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.ALBUM_REVIEWS}?size=${size}&pageNumber=0&sort=date`
    );
  }
}

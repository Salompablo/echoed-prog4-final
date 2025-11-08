import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  SongReviewRequest,
  SongReviewResponse,
  AlbumReviewRequest,
  AlbumReviewResponse,
} from '../models/interaction';
import { PagedResponse } from '../models/api';

/**
 * @class ReviewService
 * @description Service for managing song and album reviews.
 * Handles creating reviews and fetching reviews by song/album.
 */
@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private api = inject(ApiService);

  /**
   * Creates a new song review.
   * @param spotifyId The Spotify ID of the song to review
   * @param request The review data (userId, rating, description)
   * @returns Observable containing the created song review
   */
  createSongReview(spotifyId: string, request: SongReviewRequest): Observable<SongReviewResponse> {
    return this.api.post<SongReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.SONG_REVIEWS}?spotifyId=${spotifyId}`,
      request
    );
  }

  /**
   * Creates a new album review.
   * @param spotifyId The Spotify ID of the album to review
   * @param request The review data (userId, rating, description)
   * @returns Observable containing the created album review
   */
  createAlbumReview(
    spotifyId: string,
    request: AlbumReviewRequest
  ): Observable<AlbumReviewResponse> {
    return this.api.post<AlbumReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.ALBUM_REVIEWS}?spotifyId=${spotifyId}`,
      request
    );
  }

  /**
   * Fetches all reviews for a specific song.
   * @param spotifyId The Spotify ID of the song
   * @returns Observable containing a paged response of song reviews
   */
  getSongReviews(spotifyId: string): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_SONG_REVIEWS}?spotifyId=${spotifyId}&size=100&pageNumber=0&sort=date`
    );
  }

  /**
   * Fetches all reviews for a specific album.
   * @param spotifyId The Spotify ID of the album
   * @returns Observable containing a paged response of album reviews
   */
  getAlbumReviews(spotifyId: string): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      `${API_ENDPOINTS.REVIEWS.GET_ALBUM_REVIEWS}?spotifyId=${spotifyId}&size=100&pageNumber=0&sort=date`
    );
  }

  /**
   * Deletes a song review.
   * @param reviewId The ID of the song review to delete
   * @returns Observable that completes when the review is deleted
   */
  deleteSongReview(reviewId: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REVIEWS.DELETE_SONG_REVIEW(reviewId));
  }

  /**
   * Deletes an album review.
   * @param reviewId The ID of the album review to delete
   * @returns Observable that completes when the review is deleted
   */
  deleteAlbumReview(reviewId: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REVIEWS.DELETE_ALBUM_REVIEW(reviewId));
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

  updateSongReview(songReviewId: number, request: SongReviewRequest): Observable<SongReviewResponse> {
    return this.api.put<SongReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.UPDATE_SONG_REVIEW(songReviewId)}`,
      request
    );
  }

  updateAlbumReview(albumReviewId: number, request: AlbumReviewRequest): Observable<AlbumReviewResponse> {
    return this.api.put<AlbumReviewResponse>(
      `${API_ENDPOINTS.REVIEWS.UPDATE_ALBUM_REVIEW(albumReviewId)}`,
      request
    );
  }

  getUserSongReviews(userId: number, pageNumber: number, size: number, sort: string = 'date'): Observable<PagedResponse<SongReviewResponse>> {
    return this.api.get<PagedResponse<SongReviewResponse>>(
      API_ENDPOINTS.USERS.USER_SONG_REVIEWS(userId, pageNumber, size, sort)
    );
  }

  getUserAlbumReviews(userId: number, pageNumber: number, size: number, sort: string = 'date'): Observable<PagedResponse<AlbumReviewResponse>> {
    return this.api.get<PagedResponse<AlbumReviewResponse>>(
      API_ENDPOINTS.USERS.USER_ALBUM_REVIEWS(userId, pageNumber, size, sort)
    );
  }
}

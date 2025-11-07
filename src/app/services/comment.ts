import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { CommentRequest, CommentResponse } from '../models/interaction';
import { PagedResponse } from '../models/api';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private api = inject(ApiService);
  private authService = inject(AuthService);

  getCommentsForReview(
    reviewId: number,
    reviewType: 'song' | 'album'
  ): Observable<PagedResponse<CommentResponse>> {
    const endpoint =
      reviewType === 'song'
        ? API_ENDPOINTS.COMMENTS.GET_SONG_REVIEW_COMMENTS(reviewId)
        : API_ENDPOINTS.COMMENTS.GET_ALBUM_REVIEW_COMMENTS(reviewId);
    const params = '?size=100&pageNumber=0&sort=createdAt';
    
    return this.api.get<PagedResponse<CommentResponse>>(`${endpoint}${params}`);
  }

  createComment(
    reviewId: number,
    reviewType: 'song' | 'album',
    text: string
  ): Observable<CommentResponse> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    const request: CommentRequest = {
      userId: currentUser.userId,
      text: text,
    };

    const endpoint =
      reviewType === 'song'
        ? API_ENDPOINTS.COMMENTS.POST_SONG_REVIEW_COMMENT(reviewId)
        : API_ENDPOINTS.COMMENTS.POST_ALBUM_REVIEW_COMMENT(reviewId);

    return this.api.post<CommentResponse>(endpoint, request);
  }
}
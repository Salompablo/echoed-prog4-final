import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api';
import { MusicReview } from '../models/interaction';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private api = inject(ApiService);

  getAllReviews(
    page: number = 0,
    size: number = 10,
    sort: string = 'date',
    direction: string = 'desc'
  ): Observable<PagedResponse<MusicReview>> {
    const endpoint = API_ENDPOINTS.ADMIN.REVIEWS(page, size, sort,direction);
    return this.api.get<PagedResponse<MusicReview>>(endpoint);
  }

  deleteReview(reviewId: number): Observable<void> {
    const endpoint = API_ENDPOINTS.ADMIN.DELETE_REVIEW(reviewId);
    return this.api.delete<void>(endpoint);
  }

  reActivateReview(reviewId: number){
    const endpoint = API_ENDPOINTS.ADMIN.REACTIVATE_REVIEW(reviewId);
    return this.api.put<void>(endpoint,{});
  }

  
}

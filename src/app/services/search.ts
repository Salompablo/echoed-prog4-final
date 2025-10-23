import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api'; 
import { UnifiedSearchResponse } from '../models/search';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root', 
})
export class SearchService {
  private api = inject(Api);

  /**
   * Performs a unified search in the backend
   * Calls the endpoint /api/v1/spotify/unified-search
   * @param query - Search term
   * @param page - Page number (base 0) for pagination. By default 0.
   * @param size - Results number by category per page. By default 5.
   * @returns  Observable with the answer UnifiedSearchResponse from backend.
   */
  unifiedSearch(
    query: string,
    page: number = 0,
    size: number = 5 
  ): Observable<UnifiedSearchResponse> {
    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_ENDPOINTS.SPOTIFY.UNIFIED_SEARCH}?${params.toString()}`; 
    return this.api.get<UnifiedSearchResponse>(endpoint);
  }
}
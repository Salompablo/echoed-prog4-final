import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { UnifiedSearchResponse } from '../models/search';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { AlbumSearchResponse, ArtistSearchResponse, SongSearchResponse } from '../models/music';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private api = inject(ApiService);

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

  getSongDetail(id: string): Observable<SongSearchResponse> {
    const endpoint = `${API_ENDPOINTS.SPOTIFY.SONG(id)}`;
    return this.api.get<SongSearchResponse>(endpoint);
  }

  getAlbumDetail(id: string): Observable<AlbumSearchResponse> {
    const endpoint = `${API_ENDPOINTS.SPOTIFY.ALBUM(id)}`;
    return this.api.get<AlbumSearchResponse>(endpoint);
  }

  getArtistDetail(id: string): Observable<ArtistSearchResponse> {
    const endpoint = `${API_ENDPOINTS.SPOTIFY.ARTIST(id)}`;
    return this.api.get<ArtistSearchResponse>(endpoint);
  }
}

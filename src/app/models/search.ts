import { PagedResponse } from '../models/api'; 
import { SongSearchResponse,ArtistSearchResponse,AlbumSearchResponse } from '../models/music';

export interface UnifiedSearchResponse {
    songs: PagedResponse<SongSearchResponse>;
    artists: PagedResponse<ArtistSearchResponse>;
    albums: PagedResponse<AlbumSearchResponse>;
    query: string;
}
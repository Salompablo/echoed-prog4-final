import { PagedResponse } from '../models/api'; 
import { AlbumRequest, ArtistRequest, SongRequest } from '../models/music'; 

export interface UnifiedSearchResponse {
    songs: PagedResponse<SongRequest>;
    artists: PagedResponse<ArtistRequest>;
    albums: PagedResponse<AlbumRequest>;
    query: string;
}
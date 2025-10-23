export interface Artist {
  artistId: number;
  spotifyId: string;
  name: string;
  followers?: number;
  imageUrl?: string;
}

export interface Album {
  albumId: number;
  spotifyId: string;
  title: string;
  artistName: string;
  imageUrl?: string;
  spotifyLink?: string;
  releaseDate: string;
}

export interface Song {
  songId: number;
  spotifyId: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl?: string;
  durationMs?: number;
  previewUrl?: string;
  spotifyLink?: string;
  releaseDate: string;
}

export interface ArtistRequest {
  spotifyId: string;
  name: string;
  followers?: number;
  imageUrl?: string;
}

export interface AlbumRequest {
  spotifyId: string;
  title: string;
  artistName: string;
  imageUrl?: string;
  spotifyLink?: string;
  releaseDate: string;
}

export interface SongRequest {
  spotifyId: string;
  name: string;
  artistName: string;
  albumName: string;
  imageUrl?: string;
  durationMs?: number;
  previewUrl?: string;
  spotifyLink?: string;
  releaseDate: string;
}

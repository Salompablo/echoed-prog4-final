import { Album, Song } from './music';
import { FullUserProfile, UserSummary } from './user';

export interface Reaction {
  reactionId: number;
  userId: number;
  username: string;
  reactionType: ReactionType;
  reactedType: ReactedType;
  reactedId: number;
}

export interface Comment {
  commentId: number;
  reviewId: number;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
  commentType: CommentType;
}

export interface ReviewSong {
  songId: number | null;
  spotifyId: string;
  name: string;
  artistName: string;
  artistSpotifyId?: string;
  albumName?: string;
  albumSpotifyId?: string;
  imageUrl?: string | null;
  durationMs?: number;
  releaseDate?: string;
}

export interface BaseReviewResponse {
  rating: number;
  description?: string | null;
  date: string;
  active: boolean;
  user: FullUserProfile;
}

export interface CreateReviewRequest {
  rating: number;
  description?: string;
}

export interface AlbumReviewRequest {
  userId: number;
  rating: number;
  description: string;
}

export interface SongReviewResponse {
  songReviewId: number;
  rating: number;
  description: string;
  date: string;
  active: boolean;
  user: UserSummary;
  song: Song;
}

export interface AlbumReviewResponse {
  albumReviewId: number;
  rating: number;
  description: string;
  date: string;
  active: boolean;
  user: UserSummary;
  album: Album;
}

export type MusicReview = SongReviewResponse | AlbumReviewResponse;

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  WOW = 'WOW',
  DISLIKE = 'DISLIKE',
}

export enum ReactedType {
  COMMENT = 'COMMENT',
  REVIEW = 'REVIEW',
}

export enum CommentType {
  SONG = 'SONG',
  ALBUM = 'ALBUM',
}

export interface CommentRequest {
  text: string;
}

export interface SongReviewRequest {
  userId: number;
  rating: number;
  description: string;
}

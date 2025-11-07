import { UserProfile } from './user';
import { Album, Song } from './music';
import { FullUserProfile} from './user';

export interface ReactionResponse {
  reactionId: number;
  userId: number;
  reactedId: number;     
  username: string;
  reactedType: ReactedType;  
  reactionType: ReactionType; 
}

export interface CommentResponse {
  commentId: number;
  reviewId: number;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
  commentType: CommentType;
  totalLikes: number;
  totalDislikes: number;
  totalWows: number;
  totalLoves: number;
  userReaction: ReactionResponse | null;
}

export interface CommentUpdatePayload{
  text: string;
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

export interface Review{
  rating: number;
  description: string;
  date: string;
  user: UserProfile;
  active: boolean;
  totalLikes: number;
  totalDislikes: number;
  totalWows: number;
  totalLoves: number;
  userReaction: ReactionResponse | null;
  totalComments: number;
}

export interface SongReviewResponse extends Review {
  songReviewId: number;
  song: Song;
}

export interface AlbumReviewResponse extends Review {
  albumReviewId: number;
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
  SONG = 'SONG_REVIEW',
  ALBUM = 'ALBUM_REVIEW',
}

export interface CommentRequest {
  userId: number;
  text: string;
}

export interface SongReviewRequest {
  userId: number;
  rating: number;
  description: string;
}

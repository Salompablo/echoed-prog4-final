import { Album, Song } from "./music";


export interface Reaction {
  reactionId: number;
  userId: number;
  username: string;
  reactionType: ReactionType;
  reactedType: ReactedType;
  reactedId: number;
  createdAt?: string;
}

export interface Comment {
  commentId: number;
  reviewId: number;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
  commentType: CommentType;
  active: boolean;
}

export interface Review {
  reviewId: number;
  rating: number;
  description?: string;
  date: string;
  active: boolean;
  userId: number;
  username?: string;
}

export interface CreateReviewRequest {
  rating: number;
  description?: string;
}

export interface SongReview extends Review {
  songId: number;
  song?: Song;
}

export interface AlbumReview extends Review {
  albumId: number;
  album?: Album;
}


export type MusicReview = SongReview | AlbumReview;

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

import { AuthProvider, RoleEntity } from "./auth";
import { Reaction, Review } from "./interaction";

export interface User {
  userId: number;
  username: string;
  active: boolean;
  credential?: Credential;
  reactions?: Reaction[];
  reviews?: Review[];
}

export interface Credential {
  id: number;
  email: string;
  provider: AuthProvider;
  providerId?: string;
  profilePictureUrl?: string;
  biography?: string;
  roles: RoleEntity[];
  refreshToken?: string;
}

export interface UserProfile {
  userId: number;
  username: string;
  active: boolean;
  email: string;
  provider: AuthProvider;
  profilePictureUrl?: string;
  biography?: string;
  roles: string[];
  permissions: string[];
}

export interface UserSummary {
  userId: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  active: boolean;
  roles: string[];
}

export interface UpdateUserProfileRequest {
  username?: string;
  profilePictureUrl?: string;
  biography?: string;
}

export interface UserStats {
  id: number;
  username: string;
  biography?: string;
  profilePictureUrl?: string;
  joinDate: string;

  totalAlbumReviews: number;
  totalSongReviews: number;
  totalReviews: number;
  averageRating: number;

  totalComments: number;
  albumComments: number;
  songComments: number;

  totalReactions: number;
  likesGiven: number;
  lovesGiven: number;
  wowsGiven: number;
  dislikesGiven: number;

  likesReceived: number;
  lovesReceived: number;
  wowsReceived: number;
  dislikesReceived: number;

  reviewsThisMonth: number;
  commentsThisMonth: number;
  reactionsThisMonth: number;
}

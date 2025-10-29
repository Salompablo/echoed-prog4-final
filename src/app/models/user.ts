import { AuthProvider, RoleEntity } from './auth';

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
  profilePictureUrl?: string | null;
  biography?: string | null;
  roles: string[];
  permissions: string[];
}

export interface FullUserProfile {
  id: number; 
  username: string;
  biography?: string | null; 
  profilePictureUrl?: string | null; 
  joinDate: string; 
  roles: string[]; 
  permissions: string[];
  userStats: UserStats | null; 
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
  totalAlbumReviews: number | null;
  totalSongReviews: number | null;
  totalReviews: number | null;
  averageRating: number | null;
  totalComments: number | null;
  albumComments: number | null;
  songComments: number | null;
  totalReactions: number | null;
  likesGiven: number | null;
  lovesGiven: number | null;
  wowsGiven: number | null;
  dislikesGiven: number | null;
  likesReceived: number | null;
  lovesReceived: number | null;
  wowsReceived: number | null;
  dislikesReceived: number | null;
  reviewsThisMonth: number | null;
  commentsThisMonth: number | null;
  reactionsThisMonth: number | null;
}

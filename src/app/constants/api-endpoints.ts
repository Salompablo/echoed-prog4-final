import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    ME: '/users/me',
    BY_USERNAME: (username: string) => `/users/username/${username}`,
  },
  SPOTIFY: {
    UNIFIED_SEARCH: '/spotify/unified-search',
    SONG: (id: string) => `/spotify/songs/${id}`,
    ALBUM: (id: string) => `/spotify/albums/${id}`,
    ARTIST: (id: string) => `/spotify/artists/${id}`
  },
} as const;

export const OAUTH2_LINKS = {
  GOOGLE: `${environment.apiUrl}/oauth2/authorization/google`,
} as const;

import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    ME: '/users/me',
    BY_USERNAME: (username: string) => `/users/username/${username}`
  },
  SPOTIFY: {
    UNIFIED_SEARCH: '/spotify/unified-search',
  },
} as const;

export const OAUTH2_LINKS = {
  GOOGLE: `${environment.apiUrl}/oauth2/authorization/google`,
} as const;

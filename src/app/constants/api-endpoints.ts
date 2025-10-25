import { environment } from "../../environments/environment";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  SPOTIFY: { 
    UNIFIED_SEARCH: '/spotify/unified-search',
    SONG: (id: string)  => `/spotify/songs/${id}`
  },
} as const;


export const OAUTH2_LINKS = {
  GOOGLE: `${environment.apiUrl}/oauth2/authorization/google`,
} as const;
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  SPOTIFY: { 
    UNIFIED_SEARCH: '/spotify/unified-search' 
  },
} as const;

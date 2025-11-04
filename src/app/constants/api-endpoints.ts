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
    UPDATE: (userId: number) => `/users/${userId}`,
    COMPLETE_PROFILE: '/users/complete-profile',
  },
  SPOTIFY: {
    UNIFIED_SEARCH: '/spotify/unified-search',
    SONG: (id: string) => `/spotify/songs/${id}`,
    ALBUM: (id: string) => `/spotify/albums/${id}`,
    ARTIST: (id: string) => `/spotify/artists/${id}`,
  },
  REVIEWS: {
    // Song Review endpoints
    SONG_REVIEWS: '/songreviews',
    GET_ALL_SONG_REVIEWS: '/songreviews',
    GET_SONG_REVIEW_BY_ID: (id: number) => `/songreviews/${id}`,
    CREATE_SONG_REVIEW: '/songreviews',
    GET_SONG_REVIEWS_BY_USER: (userId: number) => `/songreviews/user/${userId}`,
    GET_SONG_REVIEWS_BY_MUSIC: '/songreviews/songs',
    DELETE_SONG_REVIEW: (reviewId: number) => `/songreviews/delete/${reviewId}`,
    UPDATE_SONG_REVIEW: (songReviewId: number) => `/songreviews/${songReviewId}`,

    // Album Review endpoints
    ALBUM_REVIEWS: '/albumreviews',
    GET_ALL_ALBUM_REVIEWS: '/albumreviews',
    GET_ALBUM_REVIEW_BY_ID: (id: number) => `/albumreviews/${id}`,
    CREATE_ALBUM_REVIEW: '/albumreviews',
    GET_ALBUM_REVIEWS_BY_USER: (userId: number) => `/albumreviews/user/${userId}`,
    GET_ALBUM_REVIEWS_BY_MUSIC: '/albumreviews/albums',
    DELETE_ALBUM_REVIEW: (reviewId: number) => `/albumreviews/delete/${reviewId}`,
    UPDATE_ALBUM_REVIEW: (albumReviewId: number) => `/albumreviews/${albumReviewId}`,

    // Legacy aliases (for backward compatibility during refactor)
    GET_SONG_REVIEWS: '/songreviews/songs',
    GET_ALBUM_REVIEWS: '/albumreviews/albums',
  },
  SONGS: {
    MOST_REVIEWED_SONGS: "/stats/songs/mostReviewed"
  },
  ALBUMS: {
    MOST_REVIEWED_ALBUMS: "/stats/albums/mostReviewed"
  }
} as const;

export const OAUTH2_LINKS = {
  GOOGLE: `${environment.apiUrl}/oauth2/authorization/google`,
} as const;

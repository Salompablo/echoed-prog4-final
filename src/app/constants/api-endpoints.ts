import { environment } from '../../environments/environment';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password', 
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    ME: '/users/me',
    ADMIN_PAGINATED_SEARCH: (query: string, pageNumber: number, size: number, sort: string = 'createdAt', direction: 'asc' | 'desc' = 'desc') =>
      `/users/search?query=${query}&pageNumber=${pageNumber}&size=${size}&sort=${sort},${direction}`,
    BY_USERNAME: (username: string) => `/users/username/${username}`,
    BY_USERID: (userId: number) => `/users/${userId}`,
    UPDATE: (userId: number) => `/users/${userId}`,
    USER_SONG_REVIEWS: (userId: number, pageNumber: number, size: number, sort: string = 'date') =>
      `/songreviews/user/${userId}?pageNumber=${pageNumber}&size=${size}&sort=${sort}`,
    USER_ALBUM_REVIEWS: (userId: number, pageNumber: number, size: number, sort: string = 'date') =>
      `/albumreviews/user/${userId}?pageNumber=${pageNumber}&size=${size}&sort=${sort}`,
    COMPLETE_PROFILE: '/users/complete-profile',
    DEACTIVATE: '/users/deactivate',
    REACTIVATE: (userId: number | string) => `/users/${userId}/reactivate`,
    BAN: (userId: number | string) => `/users/${userId}/ban`,
    UNBAN: (userId: number | string) => `/users/${userId}/unban`,
    CHANGE_PASSWORD: '/users/me/change-password',
  },
  SPOTIFY: {
    UNIFIED_SEARCH: '/spotify/unified-search',
    SONG: (id: string) => `/spotify/songs/${id}`,
    ALBUM: (id: string) => `/spotify/albums/${id}`,
    ARTIST: (id: string) => `/spotify/artists/${id}`,
  },
  REVIEWS: {
    SONG_REVIEWS: '/songreviews',
    GET_SONG_REVIEWS: '/songreviews/songs',
    GET_SONG_REVIEW_BY_ID: (id: number) => `/songreviews/${id}`,
    GET_SONG_REVIEWS_BY_USER: (userId: number) => `/songreviews/user/${userId}`,
    DELETE_SONG_REVIEW: (reviewId: number) => `/songreviews/delete/${reviewId}`,
    UPDATE_SONG_REVIEW: (songReviewId: number) => `/songreviews/${songReviewId}`,

    ALBUM_REVIEWS: '/albumreviews',
    GET_ALBUM_REVIEWS: '/albumreviews/albums',
    GET_ALBUM_REVIEW_BY_ID: (id: number) => `/albumreviews/${id}`,
    GET_ALBUM_REVIEWS_BY_USER: (userId: number) => `/albumreviews/user/${userId}`,
    DELETE_ALBUM_REVIEW: (reviewId: number) => `/albumreviews/delete/${reviewId}`,
    UPDATE_ALBUM_REVIEW: (albumReviewId: number) => `/albumreviews/${albumReviewId}`,
  },
  COMMENTS: {
    GET_SONG_REVIEW_COMMENTS: (reviewId: number) => `/songreviews/${reviewId}/comments`,
    POST_SONG_REVIEW_COMMENT: (reviewId: number) => `/songreviews/${reviewId}/comments`,
    PATCH_SONG_REVIEW_COMMENT: (reviewId: number, commentId: number) =>
      `/songreviews/${reviewId}/comments/${commentId}`,
    DELETE_SONG_REVIEW_COMMENT: (reviewId: number, commentId: number) =>
      `/songreviews/${reviewId}/comments/${commentId}`,
    GET_ALBUM_REVIEW_COMMENTS: (reviewId: number) => `/albumreviews/${reviewId}/comments`,
    POST_ALBUM_REVIEW_COMMENT: (reviewId: number) => `/albumreviews/${reviewId}/comments`,
    PATCH_ALBUM_REVIEW_COMMENT: (reviewId: number, commentId: number) =>
      `/albumreviews/${reviewId}/comments/${commentId}`,
    DELETE_ALBUM_REVIEW_COMMENT: (reviewId: number, commentId: number) =>
      `/albumreviews/${reviewId}/comments/${commentId}`,
  },
  REACTIONS: {
    ADD_TO_REVIEW: (reviewId: number | string) => `/reviews/${reviewId}/reactions`,
    ADD_TO_COMMENT: (commentId: number | string) => `/comments/${commentId}/reactions`,
    UPDATE: (reactionId: number | string) => `/reactions/${reactionId}`,
    DELETE: (
      reactedType: 'review' | 'comment',
      parentId: number | string,
      reactionId: number | string
    ) => `/${reactedType}s/${parentId}/reactions/${reactionId}`,
  },
  SONGS: {
    MOST_REVIEWED_SONGS: '/stats/songs/mostReviewed',
  },
  ALBUMS: {
    MOST_REVIEWED_ALBUMS: '/stats/albums/mostReviewed',
  },
  ADMIN: {
    REVIEWS: (pageNumber: number, size: number, sort: string, direction: string) => `/admin/reviews?pageNumber=${pageNumber}&size=${size}&sort=${sort}&direction=${direction}`,
    DELETE_REVIEW: (reviewId : number) => `/admin/review/${reviewId}`,
    REACTIVATE_REVIEW: (reviewId : number) => `/admin/review/${reviewId}/reactivate`,
  },
} as const;

export const OAUTH2_LINKS = {
  GOOGLE: `${environment.apiUrl}/oauth2/authorization/google`,
} as const;

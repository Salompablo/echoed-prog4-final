export interface AdminDashboardResponse {
  // User statistics
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;

  // Content statistics
  totalReviews: number;
  totalComments: number;
  totalReactions: number;

  // Activity breakdown
  albumReviews: number;
  songReviews: number;
  likesCount: number;
  lovesCount: number;
  wowsCount: number;
  dislikesCount: number;
}

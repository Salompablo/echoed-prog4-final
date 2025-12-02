import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FullUserProfile } from '../../models/user';
import { UserService } from '../../services/user';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { LoadingSpinner } from "../../components/loading-spinner/loading-spinner";
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin';
import { AlbumReviewResponse, MusicReview, SongReviewResponse } from '../../models/interaction';

type DashboardSection = 'users' | 'reviews' | 'statistics';

@Component({
  selector: 'app-admin-dashboard',
  imports: [LoadingSpinner, FormsModule, RouterLink, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private userService = inject(UserService);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);

  // Navigation
  activeSection = signal<DashboardSection>('users');

  // Users section
  users = signal<FullUserProfile[]>([]);
  usersLoading = signal(true);
  searchQuery = signal('');
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = computed(() => Math.ceil(this.totalElements() / this.pageSize()));
  sortProperty = signal('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');
  actionLoadingMap = signal<Map<number, boolean>>(new Map());
  private searchSubject = new Subject<string>();

  // Reviews section
  reviews = signal<MusicReview[]>([]);
  reviewsLoading = signal(true);
  reviewsCurrentPage = signal(0);
  reviewsPageSize = signal(10);
  reviewsTotalElements = signal(0);
  reviewsTotalPages = signal(0);
  reviewsSortColumn = signal('date');
  reviewsSortDirection = signal<'asc' | 'desc'>('desc');

  ngOnInit(): void {
    this.loadUsers();

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((query) => {
      this.searchQuery.set(query);
      this.currentPage.set(0);
      this.loadUsers();
    });
  }

  switchSection(section: DashboardSection): void {
    this.activeSection.set(section);

    if (section === 'reviews' && this.reviews().length === 0) {
      this.loadReviews();
    } else if (section === 'users' && this.users().length === 0) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.usersLoading.set(true);

    this.userService
      .getPaginatedUsers(
        this.searchQuery(),
        this.currentPage(),
        this.pageSize(),
        this.sortProperty(),
        this.sortDirection()
      )
      .subscribe({
        next: (response) => {
          this.users.set(response.content as FullUserProfile[]);
          this.totalElements.set(response.totalElements);
          this.usersLoading.set(false);
        },
        error: (err) => {
          this.toastService.error(
            'Failed to load users: ' + this.errorService.getErrorMessage(err)
          );
          this.usersLoading.set(false);
        },
      });
  }

  onSearchQueryChange(query: string): void {
    this.searchSubject.next(query);
  }

  onSort(property: string): void {
    const finalProperty = property === 'email' ? 'credential.email' : property;

    if (this.sortProperty() === finalProperty) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortProperty.set(finalProperty);
      this.sortDirection.set('desc');
    }
    this.currentPage.set(0);
    this.loadUsers();
  }

  getSortIcon(property: string): string {
    const isCurrentSort = this.sortProperty() === property;

    if (property === 'email' && this.sortProperty() === 'credential.email') {
      return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
    }

    if (!isCurrentSort) return 'swap_vert';
    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  pagesArray = computed(() => {
    const totalPages = this.totalPages();
    if (totalPages === 0) return [];

    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage() - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  });

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.currentPage.set(newPage);
      this.loadUsers();
    }
  }

  isActionLoading(userId: number): boolean {
    return this.actionLoadingMap().get(userId) || false;
  }

  onBanUser(userId: number): void {
    this.setActionLoading(userId, true);
    this.userService.banUser(userId).subscribe({
      next: () => {
        this.toastService.success(`User ${userId} successfully banned.`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(this.errorService.getErrorMessage(err));
        this.setActionLoading(userId, false);
      },
    });
  }

  onUnbanUser(userId: number): void {
    this.setActionLoading(userId, true);
    this.userService.unbanUser(userId).subscribe({
      next: () => {
        this.toastService.success(`User ${userId} successfully unbanned.`);
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.error(this.errorService.getErrorMessage(err));
        this.setActionLoading(userId, false);
      },
    });
  }

  private setActionLoading(userId: number, loading: boolean): void {
    this.actionLoadingMap.update((map) => {
      const newMap = new Map(map);
      if (loading) {
        newMap.set(userId, true);
      } else {
        newMap.delete(userId);
      }
      return newMap;
    });
  }

  // Reviews section methods
  loadReviews(): void {
    this.reviewsLoading.set(true);
    this.adminService
      .getAllReviews(
        this.reviewsCurrentPage(),
        this.reviewsPageSize(),
        this.reviewsSortColumn(),
        this.reviewsSortDirection()
      )
      .subscribe({
        next: (response) => {
          this.reviews.set(response.content);
          this.reviewsTotalElements.set(response.totalElements);
          this.reviewsTotalPages.set(response.totalPages);
          this.reviewsLoading.set(false);
        },
        error: (err) => {
          this.toastService.error(
            'Failed to load reviews: ' + this.errorService.getErrorMessage(err)
          );
          this.reviewsLoading.set(false);
        },
      });
  }

  onReviewsSort(column: string): void {
    if (this.reviewsSortColumn() === column) {
      const newDirection = this.reviewsSortDirection() === 'asc' ? 'desc' : 'asc';
      this.reviewsSortDirection.set(newDirection);
    } else {
      this.reviewsSortColumn.set(column);
      this.reviewsSortDirection.set('asc');
    }
    this.loadReviews();
  }

  getReviewsSortIcon(column: string): string {
    if (this.reviewsSortColumn() !== column) {
      return 'swap_vert';
    }
    return this.reviewsSortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  isSongReview(review: MusicReview): review is SongReviewResponse {
    return 'song' in review;
  }

  getItemTitle(review: MusicReview): string {
    return this.isSongReview(review)
      ? review.song.name
      : (review as AlbumReviewResponse).album.title;
  }

  getItemType(review: MusicReview): string {
    return this.isSongReview(review) ? 'Song' : 'Album';
  }

  nextReviewsPage(): void {
    if (this.reviewsCurrentPage() < this.reviewsTotalPages() - 1) {
      this.reviewsCurrentPage.update((p) => p + 1);
      this.loadReviews();
    }
  }

  prevReviewsPage(): void {
    if (this.reviewsCurrentPage() > 0) {
      this.reviewsCurrentPage.update((p) => p - 1);
      this.loadReviews();
    }
  }

  onReviewsPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.reviewsTotalPages()) {
      this.reviewsCurrentPage.set(newPage);
      this.loadReviews();
    }
  }

  reviewsPagesArray = computed(() => {
    const totalPages = this.reviewsTotalPages();
    if (totalPages === 0) return [];

    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.reviewsCurrentPage() - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  });

  getReviewItemLink(review: MusicReview): any[] {
    if (this.isSongReview(review)) {
      return ['/songs', review.song.spotifyId];
    } else {
      return ['/albums', review.album.spotifyId];
    }
  }

  deleteReview(review: MusicReview): void {
    const id = this.isSongReview(review)
      ? review.songReviewId
      : (review as AlbumReviewResponse).albumReviewId;

    this.adminService.deleteReview(id).subscribe({
      next: () => {
        this.toastService.success('Review deactivated successfully');
        this.loadReviews();
      },
      error: (err) => {
        this.toastService.error('Error deleting review: ' + this.errorService.getErrorMessage(err));
      },
    });
  }

  reActivateReview(review: MusicReview): void {
    const id = this.isSongReview(review)
      ? review.songReviewId
      : (review as AlbumReviewResponse).albumReviewId;

    this.adminService.reActivateReview(id).subscribe({
      next: () => {
        this.toastService.success('Review reactivated successfully');
        this.loadReviews();
      },
      error: (err) => {
        this.toastService.error('Error reactivating review: ' + this.errorService.getErrorMessage(err));
      },
    });
  }
}

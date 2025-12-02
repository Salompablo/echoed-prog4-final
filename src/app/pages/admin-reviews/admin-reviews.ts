import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { AdminService } from '../../services/admin';
import { ReviewService } from '../../services/review';
import { ToastService } from '../../services/toast';
import { AlbumReviewResponse, MusicReview, SongReviewResponse } from '../../models/interaction';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-reviews',
  imports: [CommonModule, DatePipe, LoadingSpinner, RouterLink, TranslateModule],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css',
})
export class AdminReviews implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  reviews = signal<MusicReview[]>([]);
  isLoading = signal(true);

  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  sortColumn = signal('date');
  sortDirection = signal<'asc' | 'desc'>('desc');

  ngOnInit(): void {
    this.loadReviews();
    console.log('Current page:' + this.currentPage());
  }

  loadReviews() {
    this.isLoading.set(true);
    this.adminService
      .getAllReviews(this.currentPage(), this.pageSize(), this.sortColumn(), this.sortDirection())
      .subscribe({
        next: (response) => {
          this.reviews.set(response.content);
          this.totalElements.set(response.totalElements);
          this.totalPages.set(response.totalPages);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);

          this.isLoading.set(false);
        },
      });
  }

  onSort(column: string) {
    if (this.sortColumn() === column) {
      const newDirection = this.sortDirection() === 'asc' ? 'desc' : 'asc';
      this.sortDirection.set(newDirection);
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    this.loadReviews();
  }

  getSortIcon(column: string) {
    if (this.sortColumn() !== column) {
      return 'unfold_more';
    }
    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
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

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((p) => p + 1);
      this.loadReviews();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.loadReviews();
    }
  }

  getReviewItemLink(review: MusicReview): any[] {
    if (this.isSongReview(review)) {
      return ['/songs', review.song.spotifyId];
    } else {
      return ['/albums', review.album.spotifyId];
    }
  }

  deleteReview(review: MusicReview) {
    const id = this.isSongReview(review)
      ? review.songReviewId
      : (review as AlbumReviewResponse).albumReviewId;
    console.log(id);

    this.adminService.deleteReview(id).subscribe({
      next: () => {
        this.toastService.success('Review deactivated successfully');
        this.loadReviews();
      },
      error: (err) => {
        this.toastService.error('Error deleting review');
      },
    });
  }

  reActivateReview(review: MusicReview) {
    const id = this.isSongReview(review)
      ? review.songReviewId
      : (review as AlbumReviewResponse).albumReviewId;
    console.log(id);

    this.adminService.reActivateReview(id).subscribe({
      next: () => {
        this.toastService.success('Review reactivated successfully');
        this.loadReviews();
      },
      error: (erro) => {
        this.toastService.error('Error reactivating review');
      },
    });
  }

  
}

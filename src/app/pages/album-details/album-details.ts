import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlbumSearchResponse } from '../../models/music';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { ReviewModal } from '../../components/review-modal/review-modal';
import { AlbumReviewRequest, AlbumReviewResponse, MusicReview } from '../../models/interaction';
import { AuthService } from '../../services/auth';
import { ReviewService } from '../../services/review';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { DatePipe } from '@angular/common';
import { ReviewList } from '../../components/review-list/review-list';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-album-details',
  imports: [RouterLink, ReviewModal, DatePipe, ReviewList,LoadingSpinner, TranslateModule],
  templateUrl: './album-details.html',
  styleUrl: './album-details.css',
})
export class AlbumDetails implements OnInit {
  album: AlbumSearchResponse | null = null;
  showTracks: boolean = false;
  reviews = signal<AlbumReviewResponse[]>([]);
  isLoading: boolean = true;
  isLoadingReviews = signal(false);
  isModalOpen = signal(false);
  isSubmittingReview = signal(false);
  errorMessage = signal<string | null>(null);
  loadError = signal<string | null>(null);
  userExistingReview = signal<AlbumReviewResponse | null>(null);
  reviewToEdit = signal<{ rating: number; description: string } | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const albumId = params['spotifyId'];
          this.isLoading = true;
          this.reviews.set([]); // Reset reviews when navigating to a new album
          this.loadError.set(null); // Reset error state
          this.reviewToEdit.set(null); // Reset review edit state
          this.userExistingReview.set(null); // Reset existing review
          this.isModalOpen.set(false); // Close modal if open

          if (albumId) {
            return this.searchService.getAlbumDetail(albumId);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {
          this.album = data;
          this.isLoading = false;
          if (data) {
            this.loadReviews(data.spotifyId);
          }
        },
        error: (e) => {
          console.error('Error loading album: ', e);
          this.isLoading = false;

          // Check if it's an authentication error
          if (e.status === 401 || e.status === 403) {
            this.loadError.set('You need to be logged in to view album details.');
            // Optionally redirect to login after a delay
            setTimeout(() => {
              this.router.navigate(['/login'], {
                queryParams: { returnUrl: this.router.url },
              });
            }, 2000);
          } else {
            const message = this.errorService.getErrorMessage(e);
            this.loadError.set(message);
          }
        },
      });
  }

  loadReviews(spotifyId: string): void {
    this.isLoadingReviews.set(true);
    this.reviewService.getAlbumReviews(spotifyId).subscribe({
      next: (response) => {
        this.reviews.set(response.content);
        this.checkUserExistingReview();
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoadingReviews.set(false);
      },
    });
  }

  checkUserExistingReview(): void {
    const currentUserId = this.currentUser()?.userId;
    if (!currentUserId) {
      this.userExistingReview.set(null);
      return;
    }

    const existing = this.reviews().find((review) => {
      const reviewUserId = (review.user as any).userId ?? (review.user as any).id;
      return reviewUserId === currentUserId;
    });

    this.userExistingReview.set(existing || null);
  }

  openTracklist(){
    if(this.showTracks){
      this.showTracks=false
    }else{
      this.showTracks=true
    }
  }

  openReviewModal(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    const existing = this.userExistingReview();
    if (existing) {
      this.reviewToEdit.set({
        rating: existing.rating,
        description: existing.description,
      });
    } else {
      this.reviewToEdit.set(null);
    }

    this.isModalOpen.set(true);
  }

  closeReviewModal(): void {
    this.isModalOpen.set(false);
    this.reviewToEdit.set(null);
  }

  onReviewEditRequest(review: MusicReview): void {
    const albumReview = review as AlbumReviewResponse;
    this.reviewToEdit.set({
      rating: albumReview.rating,
      description: albumReview.description,
    });
    this.isModalOpen.set(true);
  }

  handleReviewSubmit(reviewData: Partial<AlbumReviewRequest>): void {
    if (!this.album || !this.currentUser() || this.isSubmittingReview()) {
      return;
    }

    this.isSubmittingReview.set(true);

    const userId = this.currentUser()!.userId;
    const request: AlbumReviewRequest = {
      userId,
      rating: reviewData.rating!,
      description: reviewData.description!,
    };

    const existingReview = this.userExistingReview();

    if (existingReview) {
      this.reviewService.updateAlbumReview(existingReview.albumReviewId, request).subscribe({
        next: (response) => {
          this.toastService.success('Echo updated successfully!');
          this.isModalOpen.set(false);
          this.reviewToEdit.set(null);
          this.isSubmittingReview.set(false);
          this.loadReviews(this.album!.spotifyId);
        },
        error: (err) => {
          const message = this.errorService.getErrorMessage(err);
          this.toastService.error(message);
          this.errorService.logError(err, 'AlbumDetails - Update Review');
          this.isSubmittingReview.set(false);
        },
      });
    } else {
      this.reviewService.createAlbumReview(this.album.spotifyId, request).subscribe({
        next: (response) => {
          this.toastService.success('Echo created successfully!');
          this.isModalOpen.set(false);
          this.reviewToEdit.set(null);
          this.isSubmittingReview.set(false);
          this.loadReviews(this.album!.spotifyId);
        },
        error: (err) => {
          const message = this.errorService.getErrorMessage(err);
          this.toastService.error(message);
          this.errorService.logError(err, 'AlbumDetails - Create Review');
          this.isSubmittingReview.set(false);
        },
      });
    }
  }

  formatDuration(ms: number | undefined): string {
    if (ms === undefined || ms === null) {
      return '--:--';
    }

    const totalSeconds = Math.floor(ms / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
  }

  onReviewDeleted(reviewId: number): void {
    this.reviews.update((current) =>
      current.filter((review) => review.albumReviewId !== reviewId)
    );
    this.checkUserExistingReview();
  }
}

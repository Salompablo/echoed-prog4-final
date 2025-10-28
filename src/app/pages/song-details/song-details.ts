import { Component, inject, OnInit, signal } from '@angular/core';
import { SongSearchResponse } from '../../models/music';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { ReviewModal } from '../../components/review-modal/review-modal';
import { SongReviewRequest, SongReviewResponse } from '../../models/interaction';
import { Auth } from '../../services/auth';
import { ReviewService } from '../../services/review';
import { ErrorService } from '../../services/error';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-song-details',
  imports: [RouterLink, ReviewModal, DatePipe],
  templateUrl: './song-details.html',
  styleUrl: './song-details.css'
})
export class SongDetails implements OnInit {

  song: SongSearchResponse | null = null;
  reviews = signal<SongReviewResponse[]>([]);
  isLoading: boolean = true;
  isLoadingReviews = signal(false);
  isModalOpen = signal(false);
  errorMessage = signal<string | null>(null);
  loadError = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private authService = inject(Auth);
  private reviewService = inject(ReviewService);
  private errorService = inject(ErrorService);

  currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const songId = params['spotifyId'];
        this.isLoading = true;
        this.reviews.set([]); // Reset reviews when navigating to a new song
        this.loadError.set(null); // Reset error state

        if (songId) {
          return this.searchService.getSongDetail(songId);
        }
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        this.song = data;
        this.isLoading = false;
        if (data) {
          this.loadReviews(data.spotifyId);
        }
      },
      error: (e) => {
        console.error('Error loading song: ', e);
        this.isLoading = false;

        // TODO: We will add a Toast Service later, change this
        // Check if it's an authentication error
        if (e.status === 401 || e.status === 403) {
          this.loadError.set('You need to be logged in to view song details.');
          // Optionally redirect to login after a delay
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: this.router.url }
            });
          }, 2000);
        } else {
          const message = this.errorService.getErrorMessage(e);
          this.loadError.set(message);
        }
      }
    })

  }

  loadReviews(spotifyId: string): void {
    this.isLoadingReviews.set(true);
    this.reviewService.getSongReviews(spotifyId).subscribe({
      next: (response) => {
        this.reviews.set(response.content);
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        // TODO: We will add a Toast Service later, change this
        console.error('Error loading reviews:', err);
        this.isLoadingReviews.set(false);
      }
    });
  }

  openReviewModal(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isModalOpen.set(true);
    this.errorMessage.set(null);
  }

  closeReviewModal(): void {
    this.isModalOpen.set(false);
  }

  handleReviewSubmit(reviewData: Partial<SongReviewRequest>): void {
    if (!this.song || !this.currentUser()) {
      return;
    }

    const userId = this.currentUser()!.userId;
    const request: SongReviewRequest = {
      userId,
      rating: reviewData.rating!,
      description: reviewData.description!,
    };

    this.reviewService.createSongReview(this.song.spotifyId, request).subscribe({
      next: (response) => {
        // TODO: We will add a Toast Service later, change this
        console.log('Review created successfully', response);
        this.isModalOpen.set(false);
        this.loadReviews(this.song!.spotifyId);
      },
      error: (err) => {
        // TODO: We will add a Toast Service later, change this
        const message = this.errorService.getErrorMessage(err);
        this.errorMessage.set(message);
        this.errorService.logError(err, 'SongDetails - Create Review');
      },
    });
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
}
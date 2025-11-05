import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlbumSearchResponse } from '../../models/music';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { ReviewModal } from '../../components/review-modal/review-modal';
import { AlbumReviewRequest, AlbumReviewResponse } from '../../models/interaction';
import { AuthService } from '../../services/auth';
import { ReviewService } from '../../services/review';
import { ErrorService } from '../../services/error';
import { DatePipe } from '@angular/common';
import { ReviewCard } from '../../components/review-card/review-card';


@Component({
  selector: 'app-album-details',
  imports: [RouterLink, ReviewModal, DatePipe, ReviewCard],
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
  errorMessage = signal<string | null>(null);
  loadError = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private searchService = inject(SearchService);
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);
  private errorService = inject(ErrorService);


  currentUser = this.authService.currentUser;


  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const albumId = params['spotifyId'];
          this.isLoading = true;
          this.reviews.set([]); // Reset reviews when navigating to a new album
          this.loadError.set(null); // Reset error state


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
        this.isLoadingReviews.set(false);
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.isLoadingReviews.set(false);
      },
    });
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
    this.isModalOpen.set(true);
    this.errorMessage.set(null);
  }


  closeReviewModal(): void {
    this.isModalOpen.set(false);
  }


  handleReviewSubmit(reviewData: Partial<AlbumReviewRequest>): void {
    if (!this.album || !this.currentUser()) {
      return;
    }


    const userId = this.currentUser()!.userId;
    const request: AlbumReviewRequest = {
      userId,
      rating: reviewData.rating!,
      description: reviewData.description!,
    };


    this.reviewService.createAlbumReview(this.album.spotifyId, request).subscribe({
      next: (response) => {
        console.log('Review created successfully', response);
        this.isModalOpen.set(false);
        this.loadReviews(this.album!.spotifyId);
      },
      error: (err) => {
        const message = this.errorService.getErrorMessage(err);
        this.errorMessage.set(message);
        this.errorService.logError(err, 'AlbumDetails - Create Review');
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

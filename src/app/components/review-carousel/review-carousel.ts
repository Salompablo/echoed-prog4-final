import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review';
import { ErrorService } from '../../services/error';
import { MusicReview } from '../../models/interaction';
import { RouterLink } from '@angular/router';
import { GenericCarouselComponent } from '../generic-carousel/generic-carousel';
import { forkJoin } from 'rxjs';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-review-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, GenericCarouselComponent,LoadingSpinner, TranslateModule],
  templateUrl: './review-carousel.html',
  styleUrls: ['./review-carousel.css'],
})
export class ReviewCarousel implements OnInit {
  private reviewService = inject(ReviewService);
  private errorService = inject(ErrorService);

  latestReviews = signal<MusicReview[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadLatestReviews();
  }

  loadLatestReviews(): void {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      songReviews: this.reviewService.getAllSongReviews(50),
      albumReviews: this.reviewService.getAllAlbumReviews(50),
    }).subscribe({
      next: ({ songReviews, albumReviews }) => {
        const allReviews: MusicReview[] = [];
        allReviews.push(...songReviews.content);
        allReviews.push(...albumReviews.content);

        const sortedReviews = allReviews.sort((a, b) => b.date.localeCompare(a.date));

        this.latestReviews.set(sortedReviews.slice(0, 20));
        this.isLoading.set(false);
      },
      error: (err) => {
        const errorMessage = this.errorService.getErrorMessage(err);
        this.error.set(errorMessage);
        this.errorService.logError(err, 'ReviewCarousel - loadLatestReviews');
        this.isLoading.set(false);
      },
    });
  }

  isSongReview(review: MusicReview): boolean {
    return 'songReviewId' in review;
  }
}


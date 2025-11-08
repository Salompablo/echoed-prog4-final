import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicReview } from '../../models/interaction';
import { ReviewCard } from '../review-card/review-card';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, ReviewCard, LoadingSpinner],
  templateUrl: './review-list.html',
  styleUrls: ['./review-list.css'],
})
export class ReviewList {
  @Input({ required: true }) reviews: MusicReview[] = [];

  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  @Input() showUsername: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showRating: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showMusicInfo: boolean = false;
  @Input() showUserAvatar: boolean = false;

  @Input() emptyMessage: string = 'No reviews yet';

  @Output() reviewSelected = new EventEmitter<MusicReview>();
  @Output() reviewDeleted = new EventEmitter<number>();
  @Output() reviewEditRequest = new EventEmitter<MusicReview>();

  trackByReviewId(index: number, review: MusicReview): number {
    return 'songReviewId' in review ? review.songReviewId : review.albumReviewId;
  }

  onReviewClick(review: MusicReview): void {
    this.reviewSelected.emit(review);
  }

  onReviewDeleted(reviewId: number): void {
    this.reviewDeleted.emit(reviewId);
  }

  onReviewEditRequest(review: MusicReview): void {
    this.reviewEditRequest.emit(review);
  }
}

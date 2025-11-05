import { Component, computed, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MusicReview, SongReviewResponse, AlbumReviewResponse } from '../../models/interaction';
import { Song, Album } from '../../models/music';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './review-card.html',
  styleUrls: ['./review-card.css'],
})
export class ReviewCard {
  @Input({ required: true }) review!: MusicReview;

  @Input() mode: 'item-details' | 'profile-list' = 'item-details';

  isSongReview = computed(() => 'songReviewId' in this.review);

  musicItem = computed(() =>
    this.isSongReview()
      ? (this.review as SongReviewResponse).song
      : (this.review as AlbumReviewResponse).album
  );

  displayName = computed(() => {
    const item = this.musicItem();
    return this.isSongReview() ? (item as Song).name : (item as Album).title;
  });

  itemImageUrl = computed(() => this.musicItem().imageUrl || 'assets/default-avatar.svg');

  userAvatarUrl = computed(() => {
    const picUrl = this.review.user.profilePictureUrl;
    if (picUrl && (picUrl.startsWith('http') || picUrl.startsWith('https'))) {
      return picUrl;
    }
    if (picUrl) {
      return `assets/images/default-avatars/${picUrl}`;
    }
    return 'assets/images/default-avatar.svg';
  });

  reviewLink = computed(() =>
    this.isSongReview()
      ? ['/songs', this.musicItem().spotifyId]
      : ['/albums', this.musicItem().spotifyId]
  );
}

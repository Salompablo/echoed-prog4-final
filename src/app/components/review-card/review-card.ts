import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MusicReview, AlbumReviewResponse, SongReviewResponse } from '../../models/interaction';
import { Album, Song } from '../../models/music';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './review-card.html',
  styleUrls: ['./review-card.css']
})
export class ReviewCard{
  @Input({ required: true }) review!: MusicReview;

  @Input() showUsername: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showRating: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showMusicInfo: boolean = false;
  @Input() showUserAvatar: boolean = false;

  @Output() cardClick = new EventEmitter<MusicReview>();

  isAlbumReview(review: MusicReview): review is AlbumReviewResponse {
    return 'album' in review;
  }

  isSongReview(review: MusicReview): review is SongReviewResponse {
    return 'song' in review;
  }

  getMusicItem(): Album | Song | null {
    if (!this.review) return null;
    return this.isAlbumReview(this.review) ? this.review.album : this.review.song;
  }

  getMusicTitle(): string {
    const item = this.getMusicItem();
    if (!item) return '';
    return 'title' in item ? item.title : item.name;
  }

  getMusicArtist(): string {
    const item = this.getMusicItem();
    return item?.artistName || '';
  }

  getMusicImage(): string {
    const item = this.getMusicItem();
    return item?.imageUrl || 'assets/default-avatar.svg';
  }

  getMusicLink(): string[] {
    if (!this.review) return [];
    if (this.isAlbumReview(this.review)) {
      return ['/albums', this.review.album.spotifyId];
    }
    return ['/songs', this.review.song.spotifyId];
  }

  getUserProfileLink(): string[] {
    if (!this.review?.user?.userId) return [];
    return ['/profile', this.review.user.userId.toString()];
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  isStarFilled(position: number): boolean {
    const rating = this.review?.rating || 0;
    return position <= Math.floor(rating);
  }

  isStarHalf(position: number): boolean {
    const rating = this.review?.rating || 0;
    return position === Math.ceil(rating) && rating % 1 !== 0;
  }

  onCardClick(): void {
    this.cardClick.emit(this.review);
  }

  getUserAvatarUrl(): string {
    const picUrl = this.review?.user?.profilePictureUrl;

    if (picUrl) {
      if (picUrl.startsWith('http://') || picUrl.startsWith('https://')) {
        return picUrl;
      }
      return `assets/images/default-avatars/${picUrl}`;
    }
    return 'assets/images/default-avatars/classic-dog.png';
  }
}

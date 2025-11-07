import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  signal,
  inject,
  computed,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  MusicReview,
  AlbumReviewResponse,
  SongReviewResponse,
  CommentResponse,
  ReactionType,
  ReactedType,
  ReactionResponse,
} from '../../models/interaction';
import { Album, Song } from '../../models/music';
import { Router, RouterLink } from '@angular/router';
import { CommentList } from '../comment-list/comment-list';
import { AuthService } from '../../services/auth';
import { CommentModal } from '../comment-modal/comment-modal';
import { DeleteConfirmationModal } from '../delete-confirmation-modal/delete-confirmation-modal';
import { ReactionBar } from '../reaction-bar/reaction-bar';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, CommentList, CommentModal, DeleteConfirmationModal, ReactionBar],
  templateUrl: './review-card.html',
  styleUrls: ['./review-card.css'],
})
export class ReviewCard implements OnChanges {
  @Input({ required: true }) review!: MusicReview;

  @Input() showUsername: boolean = true;
  @Input() showDate: boolean = true;
  @Input() showRating: boolean = true;
  @Input() showDescription: boolean = true;
  @Input() showMusicInfo: boolean = false;
  @Input() showUserAvatar: boolean = false;
  @Input() showActions: boolean = true;

  @Output() cardClick = new EventEmitter<MusicReview>();
  @ViewChild(CommentList) commentListComponent?: CommentList;

  public reactionTypes = ReactionType;
  public reactedTypes = ReactedType;

  private authService = inject(AuthService);
  private router = inject(Router);

  isCommentListVisible = signal(false);
  isCommentModalVisible = signal(false);
  commentCount = signal<number>(0);

  isDeleteModalVisible = signal(false);
  isDeleting = signal(false);

  deletionTarget = computed(() => ({ 
    id: this.reviewId,
    type: 'review',
    name: this.review.description.substring(0, 30) + '...' || this.review.user.username, 
  }));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review']) {
      this.commentCount.set(this.review.totalComments || 0);
    }
  }
  reviewId = computed(() => {
    return this.isAlbumReview(this.review) ? this.review.albumReviewId : this.review.songReviewId;
  });

  reviewType = computed<'song' | 'album'>(() => {
    return this.isAlbumReview(this.review) ? 'album' : 'song';
  });

  userAvatarUrl = computed(() => {
    const picUrl = this.review?.user?.profilePictureUrl;
    return this.getAvatarUrl(picUrl);
  });

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

  onReactionChanged(newReaction: ReactionResponse | null): void {
    if (!this.review) return;

    const oldReaction = this.review.userReaction;
    this.review.userReaction = newReaction;

    if (oldReaction) {
      this.updateCounter(oldReaction.reactionType, -1);
    }

    if (newReaction) {
      this.updateCounter(newReaction.reactionType, 1);
    }
  }

  toggleCommentList(event: MouseEvent): void {
    event.stopPropagation();
    this.isCommentListVisible.update((v) => !v);
  }

  openCommentModal(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.authService.currentUser()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.isCommentModalVisible.set(true);
  }

  closeCommentModal(): void {
    this.isCommentModalVisible.set(false);
  }

  handleCommentSubmitted(newComment: CommentResponse): void {
    this.isCommentModalVisible.set(false);
    this.isCommentListVisible.set(true);
    this.commentCount.update((count) => count + 1);
    setTimeout(() => {
      this.commentListComponent?.addComment(newComment);
    }, 0);
  }

  handleCommentDeleted(): void {
    this.commentCount.update((count) => Math.max(0, count - 1));
  }

  getAvatarUrl(profilePictureUrl: string | null | undefined): string {
    if (profilePictureUrl) {
      if (profilePictureUrl.startsWith('http://') || profilePictureUrl.startsWith('https://')) {
        return profilePictureUrl;
      }
      return `assets/images/default-avatars/${profilePictureUrl}`;
    }
    return 'assets/images/default-avatars/classic-dog.png';
  }

  onDeleteReview(): void {
    this.isDeleteModalVisible.set(true);
  }
  
  onConfirmDelete(): void {
   
  }

  onCloseDeleteModal(): void {
    this.isDeleteModalVisible.set(false);
  }
}

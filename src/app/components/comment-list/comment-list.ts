import { Component, inject, Input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentResponse } from '../../models/interaction';
import { CommentCard } from '../comment-card/comment-card';
import { ToastService } from '../../services/toast';
import { CommentService } from '../../services/comment';
import { CommentModal } from '../comment-modal/comment-modal';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentCard, CommentModal, LoadingSpinner],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList implements OnInit {
  @Input({ required: true }) reviewId!: number;
  @Input({ required: true }) reviewType!: 'song' | 'album';

  deleted = output<void>();

  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  comments = signal<CommentResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isLoadingMore = signal(false);
  pageNumber = signal(0);
  hasMoreComments = signal(true);
  readonly commentsPageSize = 10;

  commentToEdit = signal<CommentResponse | undefined>(undefined);
  isEditModalVisible = signal(false);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    if (this.isLoadingMore() || !this.hasMoreComments()) return;
    if (this.pageNumber() === 0) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }
    this.error.set(null);

    this.commentService
      .getCommentsForReview(
        this.reviewId,
        this.reviewType,
        this.pageNumber(),
        this.commentsPageSize
      )
      .subscribe({
        next: (response) => {
          this.comments.update((currentComments) => [...currentComments, ...response.content]);
          this.hasMoreComments.set(!response.last);
          this.pageNumber.update((n) => n + 1);

          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        },
        error: (err) => {
          console.error('Error loading comments:', err);
          this.error.set('Could not load comments. Please try again.');
          this.toastService.error('Could not load comments.');
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        },
      });
  }
  public addComment(newComment: CommentResponse): void {
    this.comments.update((currentComments) => [newComment, ...currentComments]);
  }

  removeComment(commentId: number): void {
    this.comments.update((currentComments) =>
      currentComments.filter((c) => c.commentId !== commentId)
    );
    this.deleted.emit();
  }

  onEditRequest(comment: CommentResponse): void {
    this.commentToEdit.set(comment);
    this.isEditModalVisible.set(true);
  }

  closeEditModal(): void {
    this.isEditModalVisible.set(false);
    this.commentToEdit.set(undefined);
  }

  handleCommentUpdate(updatedComment: CommentResponse): void {
    this.comments.update((currentComments) =>
      currentComments.map((c) => (c.commentId === updatedComment.commentId ? updatedComment : c))
    );
    this.closeEditModal();
  }
}

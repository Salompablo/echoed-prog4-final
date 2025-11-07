import { Component, computed, inject, Input, OnInit, output, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentResponse } from '../../models/interaction';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { FullUserProfile } from '../../models/user';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth';
import { CommentService } from '../../services/comment';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { DeleteConfirmationModal } from '../delete-confirmation-modal/delete-confirmation-modal';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, DeleteConfirmationModal],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css',
})
export class CommentCard implements OnInit {
  @Input({ required: true }) comment!: CommentResponse;
  @Input({ required: true }) reviewType!: 'song' | 'album';
  @Input({ required: true }) reviewId!: number;

  deleteEvent = output<number>();
  editRequest = output<CommentResponse>();

  userService = inject(UserService);
  authService = inject(AuthService);
  commentService = inject(CommentService);
  toastService = inject(ToastService);
  errorService = inject(ErrorService);

  user: WritableSignal<FullUserProfile | null> = signal(null);

  isDeleteModalVisible = signal(false);
  isDeleting = signal(false);
  
  deletionTarget = computed(() => ({ 
    id: this.comment.commentId,
    type: 'comment',
    name: this.comment.text.substring(0, 30) + '...' || this.comment.username, 
  }));

  ngOnInit(): void {
    this.loadUserProfile();
  }

  isOwner = computed(() => {
    return this.authService.currentUser()?.userId === this.comment.userId;
  });

  userAvatarUrl = computed(() => {
    const picUrl = this.user()?.profilePictureUrl;
    return this.getAvatarUrl(picUrl);
  });

  async loadUserProfile(): Promise<void> {
    if (!this.comment.userId) return;
    try {
      const profile = await firstValueFrom(
        this.userService.getUserProfileByUserId(this.comment.userId)
      );
      this.user.set(profile);
      console.log('User id: ' + this.user()?.id);
    } catch (error) {
      console.error(
        `Failed to load user profile for comment from ${this.comment.username}:`,
        error
      );
    }
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

  onEditRequest(): void {
    this.editRequest.emit(this.comment);
  }

  onDeleteComment(): void {
    this.isDeleteModalVisible.set(true);
  }
  
  onConfirmDelete(): void {
    this.isDeleting.set(true);
    
    this.commentService
      .deleteComment(this.reviewId, this.comment.commentId, this.reviewType)
      .subscribe({
        next: () => {
          this.toastService.success('Comment deleted successfully!');
          this.deleteEvent.emit(this.comment.commentId);
          this.isDeleteModalVisible.set(false); 
          this.isDeleting.set(false);
        },
        error: (err) => {
          this.toastService.error(this.errorService.getErrorMessage(err));
          this.errorService.logError(err, 'CommentCard - Delete Comment');
          this.isDeleting.set(false);
        },
      });
  }

  onCloseDeleteModal(): void {
    this.isDeleteModalVisible.set(false);
  }
}

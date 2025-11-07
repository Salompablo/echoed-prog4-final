import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentResponse } from '../../models/interaction';
import { CommentCard } from '../comment-card/comment-card';
import { ToastService } from '../../services/toast';
import { CommentService } from '../../services/comment';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentCard],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentList implements OnInit {
  @Input({ required: true }) reviewId!: number;
  @Input({ required: true }) reviewType!: 'song' | 'album';

  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  comments = signal<CommentResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.commentService.getCommentsForReview(this.reviewId, this.reviewType).subscribe({
      next: (response) => {
        this.comments.set(response.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.error.set('Could not load comments. Please try again.');
        this.isLoading.set(false);
        this.toastService.error('Could not load comments.');
      },
    });
  }
  public addComment(newComment: CommentResponse): void {
    this.comments.update(currentComments => [newComment, ...currentComments]);
  }
}
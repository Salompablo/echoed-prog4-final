import { Component, inject, Input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { CommentResponse } from '../../models/interaction';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-modal.html',
  styleUrl: './comment-modal.css',
})
export class CommentModal implements OnInit {
  @Input({ required: true }) reviewId!: number;
  @Input({ required: true }) reviewType!: 'song' | 'album';
  @Input() commentToEdit?: CommentResponse;

  close = output<void>();
  submitted = output<CommentResponse>();

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);

  readonly MAX_CHARS = 500;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  commentForm: FormGroup = this.fb.group({
    text: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(this.MAX_CHARS)],
    ],
  });

  characterCount = signal(0);

  modalTitle = signal('Add your Comment');

  ngOnInit(): void {
    if (this.commentToEdit) {
      this.modalTitle.set('Edit your Comment');
      this.commentForm.get('text')?.setValue(this.commentToEdit.text);
    }else{
      this.modalTitle.set('Add your Comment');
    }
  }

  constructor() {
    this.commentForm.get('text')?.valueChanges.subscribe((value) => {
      this.characterCount.set((value || '').length);
    });
  }

  get text() {
    return this.commentForm.get('text');
  }

  onCancel(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const commentText = this.text!.value;

    let submissionObservable: Observable<CommentResponse>;

    if (this.commentToEdit) {
      //PUT
      const commentId = this.commentToEdit.commentId;
      submissionObservable = this.commentService.updateComment(
        this.reviewId,
        commentId,
        this.reviewType,
        commentText
      );
    } else {
      //POST
      submissionObservable = this.commentService.createComment(
        this.reviewId,
        this.reviewType,
        commentText
      );
    }

    submissionObservable.subscribe({
      next: (newOrUpdated) => {
        this.isLoading.set(false);
        this.toastService.success(this.commentToEdit ? 'Comment updated!' : 'Comment added!');
        this.submitted.emit(newOrUpdated);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.errorService.logError(err, 'CommentModal - Submit Comment');
      },
    });
  }
}
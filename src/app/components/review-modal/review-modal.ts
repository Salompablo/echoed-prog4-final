import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlbumSearchResponse, SongSearchResponse } from '../../models/music';
import { AlbumReviewRequest, SongReviewRequest } from '../../models/interaction';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-review-modal',
  imports: [ReactiveFormsModule, StarRating],
  templateUrl: './review-modal.html',
  styleUrl: './review-modal.css',
})
export class ReviewModal {
  type = input.required<'song' | 'album'>();
  item = input.required<SongSearchResponse | AlbumSearchResponse>();
  closed = output<void>();
  submitted = output<SongReviewRequest | AlbumReviewRequest>();

  private fb = inject(FormBuilder);

  readonly MIN_CHARS = 10;
  readonly MAX_CHARS = 500;

  reviewForm: FormGroup = this.fb.group({
    rating: [0, [Validators.required, Validators.min(0.5), Validators.max(5)]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(this.MIN_CHARS),
        Validators.maxLength(this.MAX_CHARS),
      ],
    ],
  });

  characterCount = signal<number>(0);

  isCharCountValid = computed(() => {
    const count = this.characterCount();
    return count >= this.MIN_CHARS && count <= this.MAX_CHARS;
  });

  constructor() {
    // Track description changes and update character count
    this.reviewForm.get('description')?.valueChanges.subscribe((value) => {
      this.characterCount.set((value || '').length);
    });
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { rating, description } = this.reviewForm.value;
    this.submitted.emit({ rating, description } as SongReviewRequest | AlbumReviewRequest);
  }

  onCancel(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  get rating() {
    return this.reviewForm.get('rating');
  }

  get description() {
    return this.reviewForm.get('description');
  }

  isSong = computed(() => this.type() === 'song');

  songItem = computed(() =>
    this.isSong() ? (this.item() as SongSearchResponse) : null
  );

  albumItem = computed(() =>
    !this.isSong() ? (this.item() as AlbumSearchResponse) : null
  );

  displayTitle = computed(() => {
    const currentItem = this.item();
    return this.isSong()
      ? (currentItem as SongSearchResponse).name
      : (currentItem as AlbumSearchResponse).title;
  });

  displayArtist = computed(() => {
    return this.item().artistName;
  });

  displayYear = computed(() => {
    return new Date(this.item().releaseDate).getFullYear();
  });
}

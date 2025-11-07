import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { ReactedType, ReactionResponse, ReactionType } from '../../models/interaction';
import { ReactionService } from '../../services/reaction';
import { AuthService } from '../../services/auth';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reaction-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaction-bar.html',
  styleUrl: './reaction-bar.css',
})
export class ReactionBar {
  reactedType = input.required<ReactedType>();
  parentId = input.required<number>();

  userReaction = input<ReactionResponse | null | undefined>();

  totalLikes = input<number>(0);
  totalDislikes = input<number>(0);
  totalLoves = input<number>(0);
  totalWows = input<number>(0);

  reactionChange = output<ReactionResponse | null>();

  private reactionService = inject(ReactionService);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);

  public reactionTypes = ReactionType;

  handleClick(clickedType: ReactionType): void {
    if (!this.authService.currentUser()) {
      this.toastService.info('You must be logged in to react');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading.set(true);
    const currentReaction = this.userReaction();

    if (currentReaction) {
      if (currentReaction.reactionType === clickedType) {
        this.reactionService
          .deleteReaction(this.reactedType(), this.parentId(), currentReaction.reactionId)
          .subscribe({
            next: () => this.reactionChange.emit(null),
            error: (err) => this.handleError(err),
            complete: () => this.isLoading.set(false),
          });
      } else {
        this.reactionService.updateReaction(currentReaction.reactionId, clickedType).subscribe({
          next: (updatedReaction) => this.reactionChange.emit(updatedReaction),
          error: (err) => this.handleError(err),
          complete: () => this.isLoading.set(false),
        });
      }
    } else {
      this.reactionService.addReaction(this.reactedType(), this.parentId(), clickedType).subscribe({
        next: (newReaction) => this.reactionChange.emit(newReaction),
        error: (err) => this.handleError(err),
        complete: () => this.isLoading.set(false),
      });
    }
  }

  private handleError(err: unknown): void {
    this.toastService.error(this.errorService.getErrorMessage(err));
    this.errorService.logError(err, 'ReactionBarComponent');
    this.isLoading.set(false);
  }
}

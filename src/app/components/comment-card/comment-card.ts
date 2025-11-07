import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  CommentResponse,
  ReactedType,
  ReactionResponse,
  ReactionType,
} from '../../models/interaction';
import { RouterLink } from '@angular/router';
import { ReactionBar } from '../reaction-bar/reaction-bar';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ReactionBar],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css',
})
export class CommentCard {
  @Input({ required: true }) comment!: CommentResponse;

  public reactionTypes = ReactionType;
  public reactedTypes = ReactedType;

  onReactionChanged(newReaction: ReactionResponse | null): void {
    if (!this.comment) return;

    const oldReaction = this.comment.userReaction;
    this.comment.userReaction = newReaction;

    if (oldReaction) {
      this.updateCounter(oldReaction.reactionType, -1);
    }

    if (newReaction) {
      this.updateCounter(newReaction.reactionType, 1);
    }
  }

  private updateCounter(type: ReactionType, delta: number): void {
    switch (type) {
      case ReactionType.LIKE:
        this.comment.totalLikes = Math.max(0, this.comment.totalLikes + delta);
        break;
      case ReactionType.LOVE:
        this.comment.totalLoves = Math.max(0, this.comment.totalLoves + delta);
        break;
      case ReactionType.WOW:
        this.comment.totalWows = Math.max(0, this.comment.totalWows + delta);
        break;
      case ReactionType.DISLIKE:
        this.comment.totalDislikes = Math.max(0, this.comment.totalDislikes + delta);
        break;
    }
  }
}

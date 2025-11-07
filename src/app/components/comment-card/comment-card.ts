import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentResponse } from '../../models/interaction';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css',
})
export class CommentCard {
  @Input({ required: true }) comment!: CommentResponse;
}
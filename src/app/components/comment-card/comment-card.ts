import { Component, computed, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommentResponse } from '../../models/interaction';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user';
import { FullUserProfile } from '../../models/user';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './comment-card.html',
  styleUrl: './comment-card.css',
})
export class CommentCard implements OnInit {
  @Input({ required: true }) comment!: CommentResponse;

  userService = inject(UserService);

  user: WritableSignal<FullUserProfile | null> = signal(null);

  ngOnInit(): void {
    this.loadUserProfile();
  }

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
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { FullUserProfile } from '../../models/user';
import { User } from '../../services/user';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  public userService = inject(User);

  public userProfile: FullUserProfile | null = null;
  public isLoading = signal(true);
  public errorLoading = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading.set(true);
    this.errorLoading.set(null);

    this.userService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoading.set(false);
        console.log('Full user profile loaded from API:', this.userProfile);
      },
      error: (err) => {
        console.error('Failed to load user profile from API:', err);
        this.errorLoading.set('Failed to load user profile. Please try again');
        this.isLoading.set(false);
      },
    });
  }
}

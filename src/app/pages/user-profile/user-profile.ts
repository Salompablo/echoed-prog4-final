import { Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { FullUserProfile, UpdateUserProfileRequest } from '../../models/user';
import { AlbumReviewResponse, SongReviewResponse } from '../../models/interaction';
import { AuthProvider } from '../../models/auth';
import { DeactivateAccountModal } from '../../components/deactivate-account-modal/deactivate-account-modal';
import { AvatarPickerModal } from '../../components/avatar-picker-modal/avatar-picker-modal';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, DeactivateAccountModal, AvatarPickerModal],
  providers: [DatePipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  private userService = inject(UserService);
  public authService = inject(AuthService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);
  private datePipe = inject(DatePipe);

  userProfile: WritableSignal<FullUserProfile | null> = signal(null);
  isEditMode = signal(false);
  isDeactivateModalVisible = signal(false);
  isAvatarModalVisible = signal(false);

  songReviews = signal<SongReviewResponse[]>([]);
  albumReviews = signal<AlbumReviewResponse[]>([]);
  reviewsLoading = signal(false);
  activeTab = signal<'reviews' | 'song-reviews' | 'album-reviews'>('reviews');

  songReviewsPage = signal(0);
  albumReviewsPage = signal(0);
  hasMoreSongReviews = signal(true);
  hasMoreAlbumReviews = signal(true);
  readonly reviewsPageSize = 5;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);

  profileForm = signal<UpdateUserProfileRequest>({
    username: '',
    biography: '',
  });

  private sessionUser = computed(() => this.authService.currentUser());

  avatarUrl = computed(() => {
    const picUrl = this.userProfile()?.profilePictureUrl;

    if (picUrl) {
      if (picUrl.startsWith('http://') || picUrl.startsWith('https://')) {
        return picUrl;
      }
      return `assets/images/default-avatars/${picUrl}`;
    }
    return 'assets/images/default-avatars/classic-dog.png';
  });

  userStats = computed(() => this.userProfile()?.userStats ?? null);

  isGoogleAccount = computed(() => this.sessionUser()?.provider === AuthProvider.GOOGLE);

  userInitials = computed(() => {
    const username = this.userProfile()?.username;
    return username ? username.substring(0, 2).toUpperCase() : '?';
  });

  accountTypeText = computed(() => {
    const provider = this.sessionUser()?.provider;
    if (provider === AuthProvider.GOOGLE) return 'Google Account';
    if (provider === AuthProvider.LOCAL) return 'Local Account';
    return 'Account';
  });

  rolesText = computed(() => {
    const roles = this.userProfile()?.roles;
    if (!roles || roles.length === 0) return 'User';
    const roleMap: Record<string, string> = {
      ROLE_USER: 'User',
      ROLE_ADMIN: 'Admin',
    };
    return roles.map((r: string) => roleMap[r] || r.replace('ROLE_', '')).join(', ');
  });

  formattedJoinDate = computed(() => {
    const joinDate = this.userProfile()?.joinDate;
    return joinDate ? this.datePipe.transform(joinDate, 'dd/MM/yyyy') : null;
  });

  hasUnsavedChanges = computed(() => {
    const profile = this.userProfile();
    const form = this.profileForm();
    if (!profile || !this.isEditMode()) return false;

    const currentUsername = profile.username ?? '';
    const formUsername = form.username ?? '';
    const currentBio = profile.biography ?? '';
    const formBio = form.biography ?? '';
    const currentAvatar = profile.profilePictureUrl ?? '';
    const formAvatar = form.profilePictureUrl ?? '';

    return (
      currentUsername !== formUsername || currentBio !== formBio || currentAvatar !== formAvatar
    );
  });

  ngOnInit(): void {
    this.loadProfileAndReviews();
  }

  async loadProfileAndReviews(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const profile = await firstValueFrom(this.userService.getCurrentUserProfile());
      this.userProfile.set(profile);
      this.initializeForm(profile);

      await this.resetAndLoadReviews();
    } catch (error) {
      this.errorService.logError(error, 'UserProfile.loadProfileAndReviews');
      const friendlyMessage = this.errorService.getErrorMessage(error);
      this.error.set(friendlyMessage);
    } finally {
      this.loading.set(false);
    }
  }

  async resetAndLoadReviews(): Promise<void> {
    const userId = this.userProfile()?.id;
    if (!userId) return;

    this.reviewsLoading.set(true);
    this.songReviews.set([]);
    this.albumReviews.set([]);
    this.songReviewsPage.set(0);
    this.albumReviewsPage.set(0);
    this.hasMoreSongReviews.set(true);
    this.hasMoreAlbumReviews.set(true);

    try {
      const [songRes, albumRes] = await Promise.all([
        firstValueFrom(this.userService.getUserSongReviewsById(userId, 0, this.reviewsPageSize)),
        firstValueFrom(this.userService.getUserAlbumReviewsById(userId, 0, this.reviewsPageSize)),
      ]);
      this.songReviews.set(songRes.content);
      this.hasMoreSongReviews.set(!songRes.last);
      this.albumReviews.set(albumRes.content);
      this.hasMoreAlbumReviews.set(!albumRes.last);
    } catch (error) {
      this.errorService.logError(error, 'UserProfile.resetAndLoadReviews');
      this.toastService.error('Failed to load reviews.');
    } finally {
      this.reviewsLoading.set(false);
    }
  }

  async loadMoreSongReviews(): Promise<void> {
    const userId = this.userProfile()?.id;
    if (!userId || !this.hasMoreSongReviews() || this.reviewsLoading()) return;

    this.reviewsLoading.set(true);
    const nextPage = this.songReviewsPage() + 1;
    try {
      const res = await firstValueFrom(
        this.userService.getUserSongReviewsById(userId, nextPage, this.reviewsPageSize)
      );
      this.songReviews.update((current) => [...current, ...res.content]);
      this.songReviewsPage.set(nextPage);
      this.hasMoreSongReviews.set(!res.last);
    } catch (error) {
      this.errorService.logError(error, 'UserProfile.loadMoreSongReviews');
      this.toastService.error('Failed to load more song reviews.');
    } finally {
      this.reviewsLoading.set(false);
    }
  }

  async loadMoreAlbumReviews(): Promise<void> {
    const userId = this.userProfile()?.id;
    if (!userId || !this.hasMoreAlbumReviews() || this.reviewsLoading()) return;

    this.reviewsLoading.set(true);
    const nextPage = this.albumReviewsPage() + 1;
    try {
      const res = await firstValueFrom(
        this.userService.getUserAlbumReviewsById(userId, nextPage, this.reviewsPageSize)
      );
      this.albumReviews.update((current) => [...current, ...res.content]);
      this.albumReviewsPage.set(nextPage);
      this.hasMoreAlbumReviews.set(!res.last);
    } catch (error) {
      this.errorService.logError(error, 'UserProfile.loadMoreAlbumReviews');
      this.toastService.error('Failed to load more album reviews.');
    } finally {
      this.reviewsLoading.set(false);
    }
  }
  onAvatarSelected(avatarFileName: string): void {
    this.profileForm.update((form) => ({
      ...form,
      profilePictureUrl: avatarFileName,
    }));
    this.isAvatarModalVisible.set(false);
  }

  private initializeForm(profile: FullUserProfile): void {
    this.profileForm.set({
      username: profile.username,
      biography: profile.biography ?? '',
      profilePictureUrl: profile.profilePictureUrl ?? '',
    });
  }

  updateUsername(value: string): void {
    this.profileForm.update((form) => ({ ...form, username: value }));
  }

  updateBiography(value: string): void {
    this.profileForm.update((form) => ({ ...form, biography: value }));
  }

  toggleEditMode(): void {
    if (this.isEditMode()) {
      const profile = this.userProfile();
      if (profile) this.initializeForm(profile);
    }
    this.isEditMode.update((current) => !current);
  }

  async saveProfile(): Promise<void> {
    const profile = this.userProfile();
    const formData = this.profileForm();
    if (!profile) return;

    if (!formData.username || formData.username.trim().length < 3) {
      this.toastService.error('Username is required and must be at least 3 characters.');
      return;
    }

    this.saving.set(true);
    const updateData: UpdateUserProfileRequest = {
      username: formData.username.trim(),
      biography: formData.biography?.trim() || undefined,
      profilePictureUrl: formData.profilePictureUrl,
    };

    try {
      const updatedProfile = await firstValueFrom(
        this.userService.updateUserProfile(profile.id, updateData)
      );
      this.userProfile.set(updatedProfile);
      this.initializeForm(updatedProfile);
      this.isEditMode.set(false);
      this.toastService.success('Profile updated successfully');

      this.authService.updateLocalUser({
        username: updatedProfile.username,
        biography: updatedProfile.biography,
        profilePictureUrl: updatedProfile.profilePictureUrl,
      });
    } catch (error) {
      this.errorService.logError(error, 'UserProfile.saveProfile');
      if (
        error instanceof HttpErrorResponse &&
        error.status === 400 &&
        error.error?.message?.includes('Username already taken')
      ) {
        this.toastService.error('Username is already taken. Please choose another one.');
      } else {
        this.toastService.error(this.errorService.getErrorMessage(error));
      }
    } finally {
      this.saving.set(false);
    }
  }

  openAvatarModal(): void {
    this.isAvatarModalVisible.set(true);
  }

  closeAvatarModal(): void {
    this.isAvatarModalVisible.set(false);
  }

  changeTab(tab: 'reviews' | 'song-reviews' | 'album-reviews'): void {
    this.activeTab.set(tab);
  }

  async refreshProfile(): Promise<void> {
    await this.loadProfileAndReviews();
    this.toastService.info('Profile refreshed');
  }

  openDeactivateModal(): void {
    this.isDeactivateModalVisible.set(true);
  }

  closeDeactivateModal(): void {
    this.isDeactivateModalVisible.set(false);
  }
}

import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private authService = inject(AuthService);

  private isSessionExpiredModalVisibleSignal = signal(false);

  public isSessionExpiredModalVisible = this.isSessionExpiredModalVisibleSignal.asReadonly();

  public showSessionExpiredModal(): void {
    if (this.isSessionExpiredModalVisibleSignal()) return;

    this.authService.logout(false);
    this.isSessionExpiredModalVisibleSignal.set(true);
  }

  public handleExpiredSessionConfirm(): void {
    this.isSessionExpiredModalVisibleSignal.set(false);
    this.authService.navigateToLogin();
  }
}

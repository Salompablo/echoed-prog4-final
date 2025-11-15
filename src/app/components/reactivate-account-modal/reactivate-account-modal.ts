import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reactivate-account-modal',
  imports: [TranslateModule],
  templateUrl: './reactivate-account-modal.html',
  styleUrl: './reactivate-account-modal.css',
})
export class ReactivateAccountModal {
  @Input({ required: true }) userId!: number | string;
  @Output() close = new EventEmitter<void>();

  private userService = inject(UserService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onCancel(): void {
    this.close.emit();
  }

  onConfirmReactivate(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.reactivateAccount(this.userId).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('¡Account reactivated! Please, login.');
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.errorService.logError(err, 'ReactivateAccount');
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

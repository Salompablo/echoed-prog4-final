import { ErrorService } from './../../services/error';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user';
import { ToastService } from '../../services/toast';
import { passwordMatcher } from '../../validators/password-matcher';
import { PasswordUpdateRequest } from '../../models/auth';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './change-password-modal.html',
  styleUrl: '../deactivate-account-modal/deactivate-account-modal.css',
})
export class ChangePasswordModal {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordsHidden = signal(true);

  passwordForm: FormGroup = this.fb.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: passwordMatcher,
    }
  );

  get currentPassword() {
    return this.passwordForm.get('currentPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  onCancel(): void {
    this.close.emit();
  }

  onConfirmChange(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const request: PasswordUpdateRequest = this.passwordForm.value;

    this.userService.changePassword(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Password changed successfully!');
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.errorService.logError(err, 'ChangePassword');
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  togglePasswordsVisibility(): void {
    this.passwordsHidden.update((v) => !v);
  }
}

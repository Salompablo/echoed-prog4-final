import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { passwordMatcher } from '../../validators/password-matcher';

@Component({
  selector: 'app-forgot-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './forgot-password-modal.html',
  styleUrls: ['./forgot-password-modal.css'],
})
export class ForgotPasswordModal {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);

  step = signal<1 | 2>(1);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  passwordsHidden = signal(true);
  emailSentTo = signal('');

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  resetForm: FormGroup = this.fb.group(
    {
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatcher }
  );

  onCancel(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onSubmitEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const email = this.emailForm.get('email')?.value;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.emailSentTo.set(email);
        this.step.set(2); 
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  onSubmitReset(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { token, password } = this.resetForm.value;

    this.authService.resetPassword({ token, newPassword: password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Password updated successfully');
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
      },
    });
  }

  togglePasswordsVisibility(): void {
    this.passwordsHidden.update((v) => !v);
  }

  get email() {
    return this.emailForm.get('email');
  }
  get token() {
    return this.resetForm.get('token');
  }
  get password() {
    return this.resetForm.get('password');
  }
  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  
}

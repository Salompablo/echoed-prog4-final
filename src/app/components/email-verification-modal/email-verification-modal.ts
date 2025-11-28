import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ErrorService } from '../../services/error';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-email-verification-modal',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './email-verification-modal.html',
  styleUrl: './email-verification-modal.css',
})
export class EmailVerificationModal {
  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private errorService = inject(ErrorService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  verificationForm: FormGroup = this.fb.group({
    token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  get token() {
    return this.verificationForm.get('token');
  }

  onCancel(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const code = this.token!.value.trim().toUpperCase();

    this.authService.verifyAccount(code).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Your account has been successfully verified! Please login.');
        this.verified.emit();
        this.close.emit();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        console.error(err);
        
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

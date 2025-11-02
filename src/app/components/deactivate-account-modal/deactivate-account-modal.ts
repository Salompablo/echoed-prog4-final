import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deactivate-account-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deactivate-account-modal.html',
  styleUrl: './deactivate-account-modal.css',
})
export class DeactivateAccountModal implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input({ required: true }) isGoogleAccount: boolean = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  deactivateForm!: FormGroup;

  ngOnInit(): void {
    if (this.isGoogleAccount) {
        this.deactivateForm = this.fb.group({
          password: [''],
        });
    } else {
      this.deactivateForm = this.fb.group({
        password: ['', [Validators.required]],
      });
      }
  }

  get password() {
    return this.deactivateForm.get('password');
  }

  onCancel(): void {
    this.close.emit();
  }

  onConfirmDeactivate(): void {
    if (this.deactivateForm.invalid) {
      this.deactivateForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const currentPassword = this.password!.value;

    this.userService.deactivateAccount(currentPassword).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastService.success('Your account has been deactivated');
        this.close.emit();
        this.authService.logout();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.errorService.logError(err, 'DeactivateAccount');
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

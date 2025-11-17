import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { ErrorService } from '../../services/error';
import { ToastService } from '../../services/toast';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-finish-profile',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './finish-profile.html',
  styleUrl: './finish-profile.css',
})
export class FinishProfile {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_.-]*$/),
      ],
    ],
  });

  get username() {
    return this.profileForm.get('username');
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const chosenUsername = this.username!.value;

    this.userService.completeProfile(chosenUsername).subscribe({
      next: (authResponse) => {
        
        this.authService.processAndSaveAuthResponse(
          authResponse,
          true 
        );

        this.isLoading.set(false);
        this.toastService.success('¡Profile completed! Welcome to Echoed.');
        this.router.navigate(['']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.errorService.getErrorMessage(err));
        this.errorService.logError(err, 'FinishProfile');
      },
    });
  }
}

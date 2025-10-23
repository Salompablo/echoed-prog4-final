import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { AuthRequest } from '../../models/auth';
import { OAUTH2_LINKS } from '../../constants/api-endpoints';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  public errorMessage: string | null = null;
  public passwordsHidden = true;

  public googleOAuthUrl = OAUTH2_LINKS.GOOGLE;

  public loginForm: FormGroup = this.fb.group({
    emailOrUsername: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  public togglePasswordsVisibility(): void {
    this.passwordsHidden = !this.passwordsHidden;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const { emailOrUsername, password, rememberMe } = this.loginForm.value;
    const authRequest: AuthRequest = { emailOrUsername, password };

    this.authService.login(authRequest, rememberMe).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again';
        }
        console.error(err);
      },
    });
  }

  get emailOrUsername() {
    return this.loginForm.get('emailOrUsername');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

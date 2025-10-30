import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { passwordMatcher } from '../../validators/password-matcher';
import { SignupRequest } from '../../models/auth';
import { ErrorService } from '../../services/error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);
  public passwordsHidden = true;

  public errorMessage: string | null = null;

  public registerForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],

      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatcher }
  );

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    const { username, email, password } = this.registerForm.value;
    const signupRequest: SignupRequest = { username, email, password };

    this.authService.register(signupRequest, false).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        this.errorMessage = this.errorService.getErrorMessage(err);
        this.errorService.logError(err, 'Register');
      },
    });
  }

  public togglePasswordVisibility(): void {
    this.passwordsHidden = !this.passwordsHidden;
  }

  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}

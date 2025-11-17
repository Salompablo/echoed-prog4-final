import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthRequest } from '../../models/auth';
import { OAUTH2_LINKS } from '../../constants/api-endpoints';
import { ErrorService } from '../../services/error';
import { CommonModule } from '@angular/common';
import { ReactivateAccountModal } from '../../components/reactivate-account-modal/reactivate-account-modal';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user';
import { BannedAccountModal } from '../../components/banned-account-modal/banned-account-modal';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ReactivateAccountModal,BannedAccountModal],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  isReactivateModalVisible = signal(false);
  userIdToReactivate = signal<number | string | null>(null);
  isBannedModalVisible = signal(false);

  public errorMessage = signal<string | null>(null);
  public passwordsHidden = true;

  public googleOAuthUrl = OAUTH2_LINKS.GOOGLE;

  public loginForm: FormGroup = this.fb.group({
    emailOrUsername: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const oauthError = params['oauthError'];
    if (oauthError) {
      if (oauthError === 'banned') {
        this.isBannedModalVisible.set(true);
      } else if (oauthError === 'deactivated') {
        const userId = params['userId'];
        if (userId) {
          this.userIdToReactivate.set(userId);
          this.isReactivateModalVisible.set(true);
        }
      } else {
        this.errorMessage.set("An error occurred during Google authentication. Please try again.");
      }
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: null,
        replaceUrl: true
      });
    }
  });
}
  public togglePasswordsVisibility(): void {
    this.passwordsHidden = !this.passwordsHidden;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const { emailOrUsername, password, rememberMe } = this.loginForm.value;
    const authRequest: AuthRequest = {
      emailOrUsername: emailOrUsername.toLowerCase(),
      password,
    };

    this.authService.login(authRequest, rememberMe).subscribe({
      next: (response) => {
        this.router.navigate(['']);
      },
      error: (err) => {
        this.errorService.logError(err, 'Login');

        if (err instanceof HttpErrorResponse && err.status === 423) {
          const userId = err.error?.userId; 

          if (userId) {
            this.userIdToReactivate.set(userId);
            this.isReactivateModalVisible.set(true);
          } else {
            this.isBannedModalVisible.set(true);
          }
        } else {
          this.errorMessage.set(this.errorService.getErrorMessage(err));
        }
      },
    });
  }

  closeReactivateModal(): void {
    this.isReactivateModalVisible.set(false);
    this.userIdToReactivate.set(null);
  }
  closeBannedModal(): void {
    this.isBannedModalVisible.set(false);
  }
  get emailOrUsername() {
    return this.loginForm.get('emailOrUsername');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

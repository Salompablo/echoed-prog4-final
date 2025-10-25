import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-oauth2-callback',
  imports: [],
  templateUrl: './oauth2-callback.html',
  styleUrl: './oauth2-callback.css',
})
export class Oauth2Callback implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(Auth);

  ngOnInit(): void {

    const token = this.route.snapshot.queryParamMap.get('token');

    const refreshToken = this.route.snapshot.queryParamMap.get('refresh_token');

    if (token) {
      const effectiveRefreshToken = refreshToken ?? '';

      try {
        this.authService.setSessionFromOAuth(token, effectiveRefreshToken);
        this.router.navigate(['']);
      } catch (error) {
        console.error('Error during setSessionFromOAuth or navigation:', error);
        this.router.navigate(['/login']);
      }
    } else {
      console.error('Token missing in URL params.');
      this.router.navigate(['/login']);
    }
  }
}

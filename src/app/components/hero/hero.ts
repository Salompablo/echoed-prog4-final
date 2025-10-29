import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private authService = inject(AuthService);
  private router = inject(Router);

  startEchoing() {
    if (!this.authService.currentUser()) {
      this.router.navigate(['/login']);
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  }
}

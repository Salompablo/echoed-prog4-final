import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  imports: [TranslateModule],
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
      this.smoothScrollTo(window.innerHeight);
    }
  }

  private smoothScrollTo(targetPosition: number) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // Duration in milliseconds
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}

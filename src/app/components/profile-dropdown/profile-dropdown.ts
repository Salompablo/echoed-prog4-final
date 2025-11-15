import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-dropdown',
  imports: [RouterLink, TranslateModule],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.css',
})
export class ProfileDropdown {
  isDropdownOpen = signal(false);
  private eRef = inject(ElementRef);

  public authService = inject(AuthService);

  toggleDropdown() {
    this.isDropdownOpen.update((value) => !value);
  }

  @HostListener(`document:click`, [`$event`])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  logout(): void {
    this.isDropdownOpen.set(false);
    this.authService.logout();
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}

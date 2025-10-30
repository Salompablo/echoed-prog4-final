import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { SearchBar } from '../search-bar/search-bar';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { Router } from '@angular/router';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-header',
  imports: [SearchBar, ProfileDropdown, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  private router = inject(Router);

  isAuthRoute(): any {
    const currentUrl = this.router.url;
    return currentUrl.includes('/register') || currentUrl.includes('/login');
  }
}

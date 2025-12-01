import { Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { SearchBar } from '../search-bar/search-bar';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { Router, RouterLink } from '@angular/router';
import { Logo } from '../logo/logo';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n';
import { LanguageDropdown } from '../language-dropdown/language-dropdown';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, ProfileDropdown, Logo, TranslateModule, LanguageDropdown, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  private authService = inject(AuthService);
  public i18nService = inject(I18nService);
  private router = inject(Router);


  isAdmin = computed(() => {
    return this.authService.currentUser()?.roles.includes('ROLE_ADMIN');
  });

  isAuthRoute(): any {
    const currentUrl = this.router.url;
    return currentUrl.includes('/register') || currentUrl.includes('/login');
  }


}

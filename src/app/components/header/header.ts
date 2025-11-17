import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme';
import { SearchBar } from '../search-bar/search-bar';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';
import { Router } from '@angular/router';
import { Logo } from '../logo/logo';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n';
import { LanguageDropdown } from '../language-dropdown/language-dropdown';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBar, ProfileDropdown, Logo, TranslateModule, LanguageDropdown],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  public i18nService = inject(I18nService)
  private router = inject(Router);

  isAuthRoute(): any {
    const currentUrl = this.router.url;
    return currentUrl.includes('/register') || currentUrl.includes('/login');
  }
}

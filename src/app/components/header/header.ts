import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';
import { SearchBar } from "../search-bar/search-bar";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [SearchBar, ProfileDropdown, NgIf],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  public themeService = inject(Theme);
  private router = inject(Router);

  isAuthRoute() : any{
    const currentUrl = this.router.url;
    return currentUrl.includes('/register') || currentUrl.includes('/login');
  }

}

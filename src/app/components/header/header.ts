import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';
import { SearchBar } from "../search-bar/search-bar";
import { ProfileDropdown } from "../profile-dropdown/profile-dropdown";

@Component({
  selector: 'app-header',
  imports: [SearchBar, ProfileDropdown],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  public themeService = inject(Theme);

}

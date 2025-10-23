import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';
import { SearchBar } from "../search-bar/search-bar";

@Component({
  selector: 'app-header',
  imports: [SearchBar],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  public themeService = inject(Theme);

}

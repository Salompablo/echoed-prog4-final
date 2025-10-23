import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  public themeService = inject(Theme);

}

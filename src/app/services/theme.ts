import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isLightMode: boolean = true;

  private document: Document = inject(DOCUMENT);

  toggleMode() {
    this.isLightMode = !this.isLightMode;

    if (this.isLightMode) {
      this.document.documentElement.classList.remove('dark');
    } else {
      this.document.documentElement.classList.add('dark');
    }
  }
}

import { DOCUMENT, inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  isLightMode: boolean = true;

  private document: Document = inject(DOCUMENT);
  private storageKey = 'isLightMode';

  constructor() {
    const savedMode = localStorage.getItem(this.storageKey);
    if (savedMode) {
      this.isLightMode = JSON.parse(savedMode);
    }
    this.applyTheme();
  }
  toggleMode() {
    this.isLightMode = !this.isLightMode;
    localStorage.setItem(this.storageKey, JSON.stringify(this.isLightMode));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isLightMode) {
      this.document.documentElement.classList.remove('dark');
    } else {
      this.document.documentElement.classList.add('dark');
    }
  }
}

import { DOCUMENT, inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  isLightMode : boolean = true;

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

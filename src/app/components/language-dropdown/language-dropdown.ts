import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '../../services/i18n';

@Component({
  selector: 'app-language-dropdown',
  imports: [CommonModule, TranslateModule],
  templateUrl: './language-dropdown.html',
  styleUrl: './language-dropdown.css',
})
export class LanguageDropdown {
  public i18nService = inject(I18nService);
  private eRef = inject(ElementRef);

  isDropdownOpen = signal(false);

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.update((value) => !value);
  }

  selectLanguage(langCode: string): void {
    this.i18nService.changeLanguage(langCode);
    this.isDropdownOpen.set(false);
  }

  getCurrentLangCode(): string {
    return this.i18nService.currentLang().toUpperCase();
  }
}

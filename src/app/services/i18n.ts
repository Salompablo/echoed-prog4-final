import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private translateService = inject(TranslateService);
  private storageKey = 'language';

  public currentLang: WritableSignal<string> = signal('en');

  public languages = [
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Español'}
  ];

  constructor(){
    this.setupLanguage();
  }

  private setupLanguage(): void{
    const savedLang = localStorage.getItem(this.storageKey) || 'en';

    this.currentLang.set(savedLang);
    this.translateService.use(savedLang);
  }

  public changeLanguage(langCode: string): void{
    if(this.currentLang() === langCode) return;

    this.currentLang.set(langCode);
    this.translateService.use(langCode);
    localStorage.setItem(this.storageKey, langCode);
  }

  public toggleLanguage(): void{
    const newLang = this.currentLang() === 'en' ? 'es' : 'en';
    this.changeLanguage(newLang);
  }
  
}

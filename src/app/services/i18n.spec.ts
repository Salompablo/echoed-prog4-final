import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { I18nService } from './i18n';

describe('I18nService', () => {
  const STORAGE_KEY = 'language';
  let translateStub: jasmine.SpyObj<TranslateService>;

  const createService = () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslateService, useValue: translateStub }],
    });
    return TestBed.inject(I18nService);
  };

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    translateStub = jasmine.createSpyObj<TranslateService>('TranslateService', ['use']);
  });

  afterEach(() => localStorage.removeItem(STORAGE_KEY));

  it('should be created with English as the default language', () => {
    const service = createService();

    expect(service).toBeTruthy();
    expect(service.currentLang()).toBe('en');
    expect(translateStub.use).toHaveBeenCalledOnceWith('en');
  });

  it('should restore the saved language from localStorage on startup', () => {
    localStorage.setItem(STORAGE_KEY, 'es');

    const service = createService();

    expect(service.currentLang()).toBe('es');
    expect(translateStub.use).toHaveBeenCalledOnceWith('es');
  });

  it('should expose English and Spanish as available languages', () => {
    const service = createService();

    expect(service.languages.map((l) => l.code)).toEqual(['en', 'es']);
  });

  it('changeLanguage should update the signal, the translate service and localStorage', () => {
    const service = createService();

    service.changeLanguage('es');

    expect(service.currentLang()).toBe('es');
    expect(translateStub.use).toHaveBeenCalledWith('es');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('es');
  });

  it('changeLanguage should do nothing when the language is already selected', () => {
    const service = createService();
    translateStub.use.calls.reset();

    service.changeLanguage('en');

    expect(translateStub.use).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

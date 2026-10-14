import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme';

describe('ThemeService', () => {
  const STORAGE_KEY = 'isLightMode';
  const root = document.documentElement;

  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    root.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    root.classList.remove('dark');
  });

  it('should be created in light mode by default', () => {
    const service = TestBed.inject(ThemeService);

    expect(service).toBeTruthy();
    expect(service.isLightMode).toBeTrue();
    expect(root.classList.contains('dark')).toBeFalse();
  });

  it('should restore dark mode from localStorage on startup', () => {
    localStorage.setItem(STORAGE_KEY, 'false');

    const service = TestBed.inject(ThemeService);

    expect(service.isLightMode).toBeFalse();
    expect(root.classList.contains('dark')).toBeTrue();
  });

  it('toggleMode should switch to dark mode, add the dark class and persist it', () => {
    const service = TestBed.inject(ThemeService);

    service.toggleMode();

    expect(service.isLightMode).toBeFalse();
    expect(root.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false');
  });

  it('toggleMode twice should go back to light mode and remove the dark class', () => {
    const service = TestBed.inject(ThemeService);

    service.toggleMode();
    service.toggleMode();

    expect(service.isLightMode).toBeTrue();
    expect(root.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });
});

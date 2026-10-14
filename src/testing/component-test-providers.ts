import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

/**
 * Providers shared by component specs. Components in this app inject services that need
 * HttpClient, Router/ActivatedRoute and TranslateService, so specs register fakes of them here
 * (no real HTTP requests and no translation files are loaded).
 */
export function provideComponentTestDeps(): (Provider | EnvironmentProviders)[] {
  return [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    ...provideTranslateService({ lang: 'en' }),
  ];
}

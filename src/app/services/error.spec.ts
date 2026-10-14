import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { ErrorService } from './error';

describe('ErrorService', () => {
  let service: ErrorService;

  // The translate stub returns the key, so each assertion shows which message was chosen.
  const httpError = (status: number, message?: string) =>
    new HttpErrorResponse({ status, error: message ? { message } : null });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslateService, useValue: { instant: (key: string) => key } }],
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the network message when status is 0', () => {
    expect(service.getErrorMessage(httpError(0))).toBe('errors.network');
  });

  it('should return the network message for client-side ErrorEvents', () => {
    const error = new HttpErrorResponse({ status: 400, error: new ErrorEvent('network') });

    expect(service.getErrorMessage(error)).toBe('errors.network');
  });

  it('should map HTTP status codes to their translation keys', () => {
    const expected: Record<number, string> = {
      400: 'errors.invalid-request',
      401: 'errors.session-expired',
      403: 'errors.permission-denied',
      404: 'errors.not-found',
      409: 'errors.conflict',
      422: 'errors.validation-failed',
      428: 'errors.validation-failed',
      423: 'errors.permission-denied',
      500: 'errors.server-error',
      503: 'errors.service-unavailable',
      418: 'errors.unexpected',
    };

    for (const [status, key] of Object.entries(expected)) {
      expect(service.getErrorMessage(httpError(Number(status)))).toBe(key);
    }
  });

  it('should prefer a known backend message over the status code message', () => {
    expect(service.getErrorMessage(httpError(401, 'Invalid credentials.'))).toBe(
      'errors.invalid-credentials',
    );
    expect(service.getErrorMessage(httpError(400, 'Username already taken'))).toBe(
      'errors.username-taken',
    );
  });

  it('should match known backend messages that are contained in a longer message', () => {
    expect(service.getErrorMessage(httpError(400, 'Error: Username already taken by someone'))).toBe(
      'errors.username-taken',
    );
  });

  it('should fall back to the status code message for unknown backend messages', () => {
    expect(service.getErrorMessage(httpError(404, 'Something custom'))).toBe('errors.not-found');
  });

  it('should return the unexpected message for generic Error objects', () => {
    expect(service.getErrorMessage(new Error('boom'))).toBe('errors.unexpected');
  });

  it('should return the unknown message for non-error values', () => {
    expect(service.getErrorMessage('just a string')).toBe('errors.unknown');
    expect(service.getErrorMessage(null)).toBe('errors.unknown');
  });

  it('logError should log with the given context as prefix', () => {
    const spy = spyOn(console, 'error');
    const error = new Error('boom');

    service.logError(error, 'LoginComponent');

    expect(spy).toHaveBeenCalledOnceWith('[LoginComponent]', error);
  });

  it('logError should use a default prefix when no context is given', () => {
    const spy = spyOn(console, 'error');

    service.logError('oops');

    expect(spy).toHaveBeenCalledOnceWith('[Error]', 'oops');
  });
});

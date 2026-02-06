import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

/**
 * @class ErrorService
 * @description Centralized service for processing HTTP errors from the backend API.
 * Converts backend error responses into user-friendly, internationalized messages.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private translate = inject(TranslateService);

  /**
   * Maps known backend error messages to translation keys.
   * This allows us to translate backend messages that are hardcoded in English.
   */
  private readonly backendMessageMap: Record<string, string> = {
    // Authentication errors
    'Invalid credentials.': 'errors.invalid-credentials',
    'Bad credentials': 'errors.invalid-credentials',
    
    // Validation errors
    'Validation failed': 'errors.validation-failed',
    'Username already taken': 'errors.username-taken',
    
    // Spotify-related errors
    'Spotify resource not found': 'errors.not-found',
    'Could not connect to Spotify service': 'errors.service-unavailable',
    
    // Account status errors
    'Account is deactivated': 'errors.session-expired',
    'Account is banned': 'errors.permission-denied',
    'Account not verified': 'errors.validation-failed',
    
    // Duplicate/conflict errors
    'You have already reviewed this': 'errors.conflict',
    'Review already exists': 'errors.conflict',
    
    // Server errors
    'Internal server error': 'errors.server-error',
  };

  /**
   * Processes an HTTP error and returns a user-friendly message.
   * @param {unknown} error The error object (typically HttpErrorResponse).
   * @returns {string} A user-friendly error message.
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return this.handleHttpError(error);
    }

    if (error instanceof Error) {
      return this.translate.instant('errors.unexpected');
    }

    return this.translate.instant('errors.unknown');
  }

  /**
   * Maps a backend error message to a translation key if known.
   * @param {string} backendMessage The error message from the backend.
   * @returns {string | null} The translated message or null if not found.
   */
  private mapBackendMessage(backendMessage: string): string | null {
    // Try exact match first
    if (this.backendMessageMap[backendMessage]) {
      return this.translate.instant(this.backendMessageMap[backendMessage]);
    }

    // Try partial match for messages that contain known patterns
    for (const [pattern, translationKey] of Object.entries(this.backendMessageMap)) {
      if (backendMessage.includes(pattern)) {
        return this.translate.instant(translationKey);
      }
    }

    return null;
  }

  /**
   * Handles HTTP errors based on status codes.
   * @param {HttpErrorResponse} error The HTTP error response from the backend.
   * @returns {string} A user-friendly error message.
   */
  private handleHttpError(error: HttpErrorResponse): string {
    // Client-side or network error (status 0 means network is down or CORS issue)
    if (error.status === 0 || error.error instanceof ErrorEvent) {
      return this.translate.instant('errors.network');
    }

    // Backend error - try to extract and map message from backend response
    const backendMessage = error.error?.message;
    const mappedMessage = backendMessage ? this.mapBackendMessage(backendMessage) : null;

    // Map common HTTP status codes to user-friendly messages
    switch (error.status) {
      case 400:
        return mappedMessage || this.translate.instant('errors.invalid-request');

      case 401:
        return mappedMessage || this.translate.instant('errors.session-expired');

      case 403:
        return mappedMessage || this.translate.instant('errors.permission-denied');

      case 404:
        return mappedMessage || this.translate.instant('errors.not-found');

      case 409:
        return mappedMessage || this.translate.instant('errors.conflict');

      case 422:
      case 428: // Account not verified
        return mappedMessage || this.translate.instant('errors.validation-failed');

      case 423: // Account locked/deactivated/banned
        return mappedMessage || this.translate.instant('errors.permission-denied');

      case 500:
        return mappedMessage || this.translate.instant('errors.server-error');

      case 503:
        return mappedMessage || this.translate.instant('errors.service-unavailable');

      default:
        return mappedMessage || this.translate.instant('errors.unexpected');
    }
  }

  /**
   * Logs error details to the console for debugging purposes.
   * @param {unknown} error The error to log.
   * @param {string} context Additional context about where the error occurred.
   */
  logError(error: unknown, context?: string): void {
    const prefix = context ? `[${context}]` : '[Error]';
    console.error(prefix, error);
  }
}

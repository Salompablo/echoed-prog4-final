import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * @class ErrorService
 * @description Centralized service for processing HTTP errors from the backend API.
 * Converts backend error responses into user-friendly messages.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
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
      return 'An unexpected error occurred. Please try again.';
    }

    return 'An unknown error occurred. Please try again.';
  }

  /**
   * Handles HTTP errors based on status codes.
   * @param {HttpErrorResponse} error The HTTP error response from the backend.
   * @returns {string} A user-friendly error message.
   */
  private handleHttpError(error: HttpErrorResponse): string {
    // Client-side or network error (status 0 means network is down or CORS issue)
    if (error.status === 0 || error.error instanceof ErrorEvent) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }

    // Backend error - try to extract message from backend response
    const backendMessage = error.error?.message;

    // Map common HTTP status codes to user-friendly messages
    switch (error.status) {
      case 400:
        return backendMessage || 'Invalid request. Please check your input and try again.';

      case 401:
        return backendMessage || 'Your session has expired. Please log in again.';

      case 403:
        return 'You do not have permission to perform this action.';

      case 404:
        return 'The requested resource was not found.';

      case 409:
        return backendMessage || 'A conflict occurred. The resource may already exist.';

      case 422:
        return backendMessage || 'Validation failed. Please check your input.';

      case 500:
        return 'An unexpected error occurred. Please try again later.';

      case 503:
        return 'The service is temporarily unavailable. Please try again in a few moments.';

      default:
        return backendMessage || 'An unexpected error occurred. Please try again.';
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

import { Injectable, signal, WritableSignal } from '@angular/core';
import ToastInfo, { ToastType } from '../models/toast';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  toasts: WritableSignal<ToastInfo[]> = signal([]);
  private nextId = 0;

  /**
   * Adds a new toast message.
   * @param type - The type of toast (success, error, etc.).
   * @param message - The message content.
   * @param duration - Optional duration in milliseconds. If not provided, toast might need manual dismissal.
   */
  show(type: ToastType, message: string, duration?: number): void {
    const newToast: ToastInfo = {
      id: this.nextId++,
      type,
      message,
      duration,
    };

    this.toasts.update((currentToasts) => [...currentToasts, newToast]);

    if (duration) {
      setTimeout(() => this.remove(newToast.id), duration);
    }
  }

  /**
   * Convenience method for success toasts.
   * @param message - The success message.
   * @param duration - Optional duration (default: 3000ms).
   */
  success(message: string, duration: number = 3000): void {
    this.show('success', message, duration);
  }

  /**
   * Convenience method for error toasts.
   * @param message - The error message.
   * @param duration - Optional duration (default: 5000ms).
   */
  error(message: string, duration: number = 5000): void {
    this.show('error', message, duration);
  }

  /**
   * Convenience method for info toasts.
   * @param message - The info message.
   * @param duration - Optional duration (default: 3000ms).
   */
  info(message: string, duration: number = 3000): void {
    this.show('info', message, duration);
  }

  /**
   * Convenience method for warning toasts.
   * @param message - The warning message.
   * @param duration - Optional duration (default: 4000ms).
   */
  warning(message: string, duration: number = 4000): void {
    this.show('warning', message, duration);
  }

  /**
   * Removes a toast by its ID.
   * @param id - The ID of the toast to remove.
   */
  remove(id: number): void {
    this.toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== id));
  }
}

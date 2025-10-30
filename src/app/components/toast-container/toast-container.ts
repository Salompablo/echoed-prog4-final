import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts.asReadonly();

  /**
   * Removes a specific toast
   * @param id - The ID of the toast to remove.
   */
  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule, TranslateModule],
  templateUrl: './delete-confirmation-modal.html',
  styleUrl: './delete-confirmation-modal.css',
})
export class DeleteConfirmationModal {
  @Input({ required: true }) target: any;
  @Input() isLoading: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onCancel(): void {
    this.close.emit();
  }

  onConfirm(): void {
    if (!this.isLoading) {
      this.confirm.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  modalTitle = computed(() => {
    switch (this.target.type) {
      case 'comment':
        return 'delete-modal.title-comment';
      case 'review':
        return 'delete-modal.title-review';
      default:
        return 'delete-modal.title-default';
    }
  });

  confirmationMessage = computed(() => {
    switch (this.target.type) {
      case 'comment':
        return 'delete-modal.msg-comment';
      case 'review':
        return 'delete-modal.msg-review';
      default:
        return 'delete-modal.msg-default';
    }
  });
}

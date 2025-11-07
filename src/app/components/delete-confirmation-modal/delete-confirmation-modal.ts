import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [CommonModule],
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
        return 'Delete Comment';
      case 'review':
        return 'Delete Echo';
      default:
        return 'Confirm Deletion';
    }
  });

  confirmationMessage = computed(() => {
    switch (this.target.type) {
      case 'comment':
        return `Are you sure you want to delete this comment? This action is irreversible.`;
      case 'review':
        return `Are you sure you want to delete this Echo? This action is irreversible.`;
      default:
        return 'Are you sure you want to proceed with the deletion?';
    }
  });
}

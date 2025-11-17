import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-banned-account-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './banned-account-modal.html',
  styleUrl: '../reactivate-account-modal/reactivate-account-modal.css', 
})
export class BannedAccountModal {
  @Output() close = new EventEmitter<void>();

  onConfirm(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onConfirm();
    }
  }
}
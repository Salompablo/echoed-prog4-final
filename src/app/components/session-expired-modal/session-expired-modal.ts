import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal';

@Component({
  selector: 'app-session-expired-modal',
  imports: [],
  templateUrl: './session-expired-modal.html',
  styleUrl: './session-expired-modal.css',
})
export class SessionExpiredModal {

  private modalService = inject(ModalService);
  
  public isVisible = this.modalService.isSessionExpiredModalVisible;

  public onConfirm(): void {
    this.modalService.handleExpiredSessionConfirm();
  }
}

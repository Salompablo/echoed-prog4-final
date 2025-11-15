import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-session-expired-modal',
  imports: [TranslateModule],
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

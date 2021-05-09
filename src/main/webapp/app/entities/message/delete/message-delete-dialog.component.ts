import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMessage } from '../message.model';
import { MessageService } from '../service/message.service';

@Component({
  templateUrl: './message-delete-dialog.component.html',
})
export class MessageDeleteDialogComponent {
  message?: IMessage;

  constructor(protected messageService: MessageService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.messageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

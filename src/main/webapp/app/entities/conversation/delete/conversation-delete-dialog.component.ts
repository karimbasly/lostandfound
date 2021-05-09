import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConversation } from '../conversation.model';
import { ConversationService } from '../service/conversation.service';

@Component({
  templateUrl: './conversation-delete-dialog.component.html',
})
export class ConversationDeleteDialogComponent {
  conversation?: IConversation;

  constructor(protected conversationService: ConversationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conversationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

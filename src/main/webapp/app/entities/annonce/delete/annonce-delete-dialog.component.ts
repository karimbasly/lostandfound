import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnnonce } from '../annonce.model';
import { AnnonceService } from '../service/annonce.service';

@Component({
  templateUrl: './annonce-delete-dialog.component.html',
})
export class AnnonceDeleteDialogComponent {
  annonce?: IAnnonce;

  constructor(protected annonceService: AnnonceService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.annonceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

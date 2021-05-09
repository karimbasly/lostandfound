import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CommentaireComponent } from './list/commentaire.component';
import { CommentaireDetailComponent } from './detail/commentaire-detail.component';
import { CommentaireUpdateComponent } from './update/commentaire-update.component';
import { CommentaireDeleteDialogComponent } from './delete/commentaire-delete-dialog.component';
import { CommentaireRoutingModule } from './route/commentaire-routing.module';

@NgModule({
  imports: [SharedModule, CommentaireRoutingModule],
  declarations: [CommentaireComponent, CommentaireDetailComponent, CommentaireUpdateComponent, CommentaireDeleteDialogComponent],
  entryComponents: [CommentaireDeleteDialogComponent],
})
export class CommentaireModule {}

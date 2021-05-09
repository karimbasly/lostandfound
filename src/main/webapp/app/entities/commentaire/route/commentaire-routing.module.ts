import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommentaireComponent } from '../list/commentaire.component';
import { CommentaireDetailComponent } from '../detail/commentaire-detail.component';
import { CommentaireUpdateComponent } from '../update/commentaire-update.component';
import { CommentaireRoutingResolveService } from './commentaire-routing-resolve.service';

const commentaireRoute: Routes = [
  {
    path: '',
    component: CommentaireComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentaireDetailComponent,
    resolve: {
      commentaire: CommentaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentaireUpdateComponent,
    resolve: {
      commentaire: CommentaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentaireUpdateComponent,
    resolve: {
      commentaire: CommentaireRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commentaireRoute)],
  exports: [RouterModule],
})
export class CommentaireRoutingModule {}

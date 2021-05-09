import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConversation, Conversation } from '../conversation.model';
import { ConversationService } from '../service/conversation.service';

@Injectable({ providedIn: 'root' })
export class ConversationRoutingResolveService implements Resolve<IConversation> {
  constructor(protected service: ConversationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConversation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((conversation: HttpResponse<Conversation>) => {
          if (conversation.body) {
            return of(conversation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Conversation());
  }
}

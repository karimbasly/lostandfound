import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConversation, getConversationIdentifier } from '../conversation.model';

export type EntityResponseType = HttpResponse<IConversation>;
export type EntityArrayResponseType = HttpResponse<IConversation[]>;

@Injectable({ providedIn: 'root' })
export class ConversationService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/conversations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(conversation: IConversation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conversation);
    return this.http
      .post<IConversation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(conversation: IConversation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conversation);
    return this.http
      .put<IConversation>(`${this.resourceUrl}/${getConversationIdentifier(conversation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(conversation: IConversation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conversation);
    return this.http
      .patch<IConversation>(`${this.resourceUrl}/${getConversationIdentifier(conversation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConversation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConversation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConversationToCollectionIfMissing(
    conversationCollection: IConversation[],
    ...conversationsToCheck: (IConversation | null | undefined)[]
  ): IConversation[] {
    const conversations: IConversation[] = conversationsToCheck.filter(isPresent);
    if (conversations.length > 0) {
      const conversationCollectionIdentifiers = conversationCollection.map(
        conversationItem => getConversationIdentifier(conversationItem)!
      );
      const conversationsToAdd = conversations.filter(conversationItem => {
        const conversationIdentifier = getConversationIdentifier(conversationItem);
        if (conversationIdentifier == null || conversationCollectionIdentifiers.includes(conversationIdentifier)) {
          return false;
        }
        conversationCollectionIdentifiers.push(conversationIdentifier);
        return true;
      });
      return [...conversationsToAdd, ...conversationCollection];
    }
    return conversationCollection;
  }

  protected convertDateFromClient(conversation: IConversation): IConversation {
    return Object.assign({}, conversation, {
      creationDate: conversation.creationDate?.isValid() ? conversation.creationDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((conversation: IConversation) => {
        conversation.creationDate = conversation.creationDate ? dayjs(conversation.creationDate) : undefined;
      });
    }
    return res;
  }
}

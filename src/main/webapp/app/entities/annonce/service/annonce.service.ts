import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnnonce, getAnnonceIdentifier } from '../annonce.model';

export type EntityResponseType = HttpResponse<IAnnonce>;
export type EntityArrayResponseType = HttpResponse<IAnnonce[]>;

@Injectable({ providedIn: 'root' })
export class AnnonceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/annonces');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(annonce: IAnnonce): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(annonce);
    return this.http
      .post<IAnnonce>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(annonce: IAnnonce): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(annonce);
    return this.http
      .put<IAnnonce>(`${this.resourceUrl}/${getAnnonceIdentifier(annonce) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(annonce: IAnnonce): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(annonce);
    return this.http
      .patch<IAnnonce>(`${this.resourceUrl}/${getAnnonceIdentifier(annonce) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAnnonce>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAnnonce[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnnonceToCollectionIfMissing(annonceCollection: IAnnonce[], ...annoncesToCheck: (IAnnonce | null | undefined)[]): IAnnonce[] {
    const annonces: IAnnonce[] = annoncesToCheck.filter(isPresent);
    if (annonces.length > 0) {
      const annonceCollectionIdentifiers = annonceCollection.map(annonceItem => getAnnonceIdentifier(annonceItem)!);
      const annoncesToAdd = annonces.filter(annonceItem => {
        const annonceIdentifier = getAnnonceIdentifier(annonceItem);
        if (annonceIdentifier == null || annonceCollectionIdentifiers.includes(annonceIdentifier)) {
          return false;
        }
        annonceCollectionIdentifiers.push(annonceIdentifier);
        return true;
      });
      return [...annoncesToAdd, ...annonceCollection];
    }
    return annonceCollection;
  }

  protected convertDateFromClient(annonce: IAnnonce): IAnnonce {
    return Object.assign({}, annonce, {
      dateAnnonce: annonce.dateAnnonce?.isValid() ? annonce.dateAnnonce.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAnnonce = res.body.dateAnnonce ? dayjs(res.body.dateAnnonce) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((annonce: IAnnonce) => {
        annonce.dateAnnonce = annonce.dateAnnonce ? dayjs(annonce.dateAnnonce) : undefined;
      });
    }
    return res;
  }
}

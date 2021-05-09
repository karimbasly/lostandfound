import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnnonce, Annonce } from '../annonce.model';
import { AnnonceService } from '../service/annonce.service';

@Injectable({ providedIn: 'root' })
export class AnnonceRoutingResolveService implements Resolve<IAnnonce> {
  constructor(protected service: AnnonceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnnonce> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((annonce: HttpResponse<Annonce>) => {
          if (annonce.body) {
            return of(annonce.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Annonce());
  }
}

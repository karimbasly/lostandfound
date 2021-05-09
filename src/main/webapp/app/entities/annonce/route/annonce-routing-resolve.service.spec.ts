jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAnnonce, Annonce } from '../annonce.model';
import { AnnonceService } from '../service/annonce.service';

import { AnnonceRoutingResolveService } from './annonce-routing-resolve.service';

describe('Service Tests', () => {
  describe('Annonce routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AnnonceRoutingResolveService;
    let service: AnnonceService;
    let resultAnnonce: IAnnonce | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AnnonceRoutingResolveService);
      service = TestBed.inject(AnnonceService);
      resultAnnonce = undefined;
    });

    describe('resolve', () => {
      it('should return IAnnonce returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnonce = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnnonce).toEqual({ id: 123 });
      });

      it('should return new IAnnonce if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnonce = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAnnonce).toEqual(new Annonce());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnnonce = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnnonce).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

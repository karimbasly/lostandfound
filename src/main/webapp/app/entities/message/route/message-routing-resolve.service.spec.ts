jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IMessage, Message } from '../message.model';
import { MessageService } from '../service/message.service';

import { MessageRoutingResolveService } from './message-routing-resolve.service';

describe('Service Tests', () => {
  describe('Message routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: MessageRoutingResolveService;
    let service: MessageService;
    let resultMessage: IMessage | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(MessageRoutingResolveService);
      service = TestBed.inject(MessageService);
      resultMessage = undefined;
    });

    describe('resolve', () => {
      it('should return IMessage returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMessage).toEqual({ id: 123 });
      });

      it('should return new IMessage if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMessage = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultMessage).toEqual(new Message());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultMessage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultMessage).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

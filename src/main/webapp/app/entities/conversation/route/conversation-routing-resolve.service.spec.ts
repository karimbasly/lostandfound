jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IConversation, Conversation } from '../conversation.model';
import { ConversationService } from '../service/conversation.service';

import { ConversationRoutingResolveService } from './conversation-routing-resolve.service';

describe('Service Tests', () => {
  describe('Conversation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ConversationRoutingResolveService;
    let service: ConversationService;
    let resultConversation: IConversation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ConversationRoutingResolveService);
      service = TestBed.inject(ConversationService);
      resultConversation = undefined;
    });

    describe('resolve', () => {
      it('should return IConversation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConversation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConversation).toEqual({ id: 123 });
      });

      it('should return new IConversation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConversation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultConversation).toEqual(new Conversation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultConversation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultConversation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});

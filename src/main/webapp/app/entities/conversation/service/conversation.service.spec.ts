import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConversation, Conversation } from '../conversation.model';

import { ConversationService } from './conversation.service';

describe('Service Tests', () => {
  describe('Conversation Service', () => {
    let service: ConversationService;
    let httpMock: HttpTestingController;
    let elemDefault: IConversation;
    let expectedResult: IConversation | IConversation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConversationService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        title: 'AAAAAAA',
        creationDate: currentDate,
        logoContentType: 'image/png',
        logo: 'AAAAAAA',
        color: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            creationDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Conversation', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            creationDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Conversation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Conversation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            creationDate: currentDate.format(DATE_TIME_FORMAT),
            logo: 'BBBBBB',
            color: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Conversation', () => {
        const patchObject = Object.assign(
          {
            creationDate: currentDate.format(DATE_TIME_FORMAT),
            color: 'BBBBBB',
          },
          new Conversation()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Conversation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            title: 'BBBBBB',
            creationDate: currentDate.format(DATE_TIME_FORMAT),
            logo: 'BBBBBB',
            color: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            creationDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Conversation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConversationToCollectionIfMissing', () => {
        it('should add a Conversation to an empty array', () => {
          const conversation: IConversation = { id: 123 };
          expectedResult = service.addConversationToCollectionIfMissing([], conversation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conversation);
        });

        it('should not add a Conversation to an array that contains it', () => {
          const conversation: IConversation = { id: 123 };
          const conversationCollection: IConversation[] = [
            {
              ...conversation,
            },
            { id: 456 },
          ];
          expectedResult = service.addConversationToCollectionIfMissing(conversationCollection, conversation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Conversation to an array that doesn't contain it", () => {
          const conversation: IConversation = { id: 123 };
          const conversationCollection: IConversation[] = [{ id: 456 }];
          expectedResult = service.addConversationToCollectionIfMissing(conversationCollection, conversation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conversation);
        });

        it('should add only unique Conversation to an array', () => {
          const conversationArray: IConversation[] = [{ id: 123 }, { id: 456 }, { id: 47726 }];
          const conversationCollection: IConversation[] = [{ id: 123 }];
          expectedResult = service.addConversationToCollectionIfMissing(conversationCollection, ...conversationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const conversation: IConversation = { id: 123 };
          const conversation2: IConversation = { id: 456 };
          expectedResult = service.addConversationToCollectionIfMissing([], conversation, conversation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(conversation);
          expect(expectedResult).toContain(conversation2);
        });

        it('should accept null and undefined values', () => {
          const conversation: IConversation = { id: 123 };
          expectedResult = service.addConversationToCollectionIfMissing([], null, conversation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(conversation);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

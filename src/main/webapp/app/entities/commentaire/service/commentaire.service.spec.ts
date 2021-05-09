import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICommentaire, Commentaire } from '../commentaire.model';

import { CommentaireService } from './commentaire.service';

describe('Service Tests', () => {
  describe('Commentaire Service', () => {
    let service: CommentaireService;
    let httpMock: HttpTestingController;
    let elemDefault: ICommentaire;
    let expectedResult: ICommentaire | ICommentaire[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CommentaireService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        text: 'AAAAAAA',
        dateCreation: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Commentaire', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.create(new Commentaire()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Commentaire', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            text: 'BBBBBB',
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Commentaire', () => {
        const patchObject = Object.assign(
          {
            text: 'BBBBBB',
          },
          new Commentaire()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Commentaire', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            text: 'BBBBBB',
            dateCreation: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateCreation: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Commentaire', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCommentaireToCollectionIfMissing', () => {
        it('should add a Commentaire to an empty array', () => {
          const commentaire: ICommentaire = { id: 123 };
          expectedResult = service.addCommentaireToCollectionIfMissing([], commentaire);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commentaire);
        });

        it('should not add a Commentaire to an array that contains it', () => {
          const commentaire: ICommentaire = { id: 123 };
          const commentaireCollection: ICommentaire[] = [
            {
              ...commentaire,
            },
            { id: 456 },
          ];
          expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, commentaire);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Commentaire to an array that doesn't contain it", () => {
          const commentaire: ICommentaire = { id: 123 };
          const commentaireCollection: ICommentaire[] = [{ id: 456 }];
          expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, commentaire);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commentaire);
        });

        it('should add only unique Commentaire to an array', () => {
          const commentaireArray: ICommentaire[] = [{ id: 123 }, { id: 456 }, { id: 15215 }];
          const commentaireCollection: ICommentaire[] = [{ id: 123 }];
          expectedResult = service.addCommentaireToCollectionIfMissing(commentaireCollection, ...commentaireArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const commentaire: ICommentaire = { id: 123 };
          const commentaire2: ICommentaire = { id: 456 };
          expectedResult = service.addCommentaireToCollectionIfMissing([], commentaire, commentaire2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(commentaire);
          expect(expectedResult).toContain(commentaire2);
        });

        it('should accept null and undefined values', () => {
          const commentaire: ICommentaire = { id: 123 };
          expectedResult = service.addCommentaireToCollectionIfMissing([], null, commentaire, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(commentaire);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});

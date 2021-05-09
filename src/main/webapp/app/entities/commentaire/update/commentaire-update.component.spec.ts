jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentaireService } from '../service/commentaire.service';
import { ICommentaire, Commentaire } from '../commentaire.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IAnnonce } from 'app/entities/annonce/annonce.model';
import { AnnonceService } from 'app/entities/annonce/service/annonce.service';

import { CommentaireUpdateComponent } from './commentaire-update.component';

describe('Component Tests', () => {
  describe('Commentaire Management Update Component', () => {
    let comp: CommentaireUpdateComponent;
    let fixture: ComponentFixture<CommentaireUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentaireService: CommentaireService;
    let userService: UserService;
    let annonceService: AnnonceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentaireUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentaireUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentaireUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentaireService = TestBed.inject(CommentaireService);
      userService = TestBed.inject(UserService);
      annonceService = TestBed.inject(AnnonceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const commentaire: ICommentaire = { id: 456 };
        const user: IUser = { id: 53039 };
        commentaire.user = user;

        const userCollection: IUser[] = [{ id: 38932 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Annonce query and add missing value', () => {
        const commentaire: ICommentaire = { id: 456 };
        const annonce: IAnnonce = { id: 10298 };
        commentaire.annonce = annonce;

        const annonceCollection: IAnnonce[] = [{ id: 41101 }];
        spyOn(annonceService, 'query').and.returnValue(of(new HttpResponse({ body: annonceCollection })));
        const additionalAnnonces = [annonce];
        const expectedCollection: IAnnonce[] = [...additionalAnnonces, ...annonceCollection];
        spyOn(annonceService, 'addAnnonceToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        expect(annonceService.query).toHaveBeenCalled();
        expect(annonceService.addAnnonceToCollectionIfMissing).toHaveBeenCalledWith(annonceCollection, ...additionalAnnonces);
        expect(comp.annoncesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const commentaire: ICommentaire = { id: 456 };
        const user: IUser = { id: 48070 };
        commentaire.user = user;
        const annonce: IAnnonce = { id: 45952 };
        commentaire.annonce = annonce;

        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(commentaire));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.annoncesSharedCollection).toContain(annonce);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commentaire = { id: 123 };
        spyOn(commentaireService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commentaire }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentaireService.update).toHaveBeenCalledWith(commentaire);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commentaire = new Commentaire();
        spyOn(commentaireService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: commentaire }));
        saveSubject.complete();

        // THEN
        expect(commentaireService.create).toHaveBeenCalledWith(commentaire);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const commentaire = { id: 123 };
        spyOn(commentaireService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ commentaire });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentaireService.update).toHaveBeenCalledWith(commentaire);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAnnonceById', () => {
        it('Should return tracked Annonce primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAnnonceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnnonceService } from '../service/annonce.service';
import { IAnnonce, Annonce } from '../annonce.model';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { AnnonceUpdateComponent } from './annonce-update.component';

describe('Component Tests', () => {
  describe('Annonce Management Update Component', () => {
    let comp: AnnonceUpdateComponent;
    let fixture: ComponentFixture<AnnonceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let annonceService: AnnonceService;
    let categorieService: CategorieService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnnonceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AnnonceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnnonceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      annonceService = TestBed.inject(AnnonceService);
      categorieService = TestBed.inject(CategorieService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Categorie query and add missing value', () => {
        const annonce: IAnnonce = { id: 456 };
        const categorie: ICategorie = { id: 69129 };
        annonce.categorie = categorie;

        const categorieCollection: ICategorie[] = [{ id: 22179 }];
        spyOn(categorieService, 'query').and.returnValue(of(new HttpResponse({ body: categorieCollection })));
        const additionalCategories = [categorie];
        const expectedCollection: ICategorie[] = [...additionalCategories, ...categorieCollection];
        spyOn(categorieService, 'addCategorieToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        expect(categorieService.query).toHaveBeenCalled();
        expect(categorieService.addCategorieToCollectionIfMissing).toHaveBeenCalledWith(categorieCollection, ...additionalCategories);
        expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const annonce: IAnnonce = { id: 456 };
        const user: IUser = { id: 27699 };
        annonce.user = user;

        const userCollection: IUser[] = [{ id: 87926 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const annonce: IAnnonce = { id: 456 };
        const categorie: ICategorie = { id: 87383 };
        annonce.categorie = categorie;
        const user: IUser = { id: 47918 };
        annonce.user = user;

        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(annonce));
        expect(comp.categoriesSharedCollection).toContain(categorie);
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const annonce = { id: 123 };
        spyOn(annonceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: annonce }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(annonceService.update).toHaveBeenCalledWith(annonce);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const annonce = new Annonce();
        spyOn(annonceService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: annonce }));
        saveSubject.complete();

        // THEN
        expect(annonceService.create).toHaveBeenCalledWith(annonce);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const annonce = { id: 123 };
        spyOn(annonceService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ annonce });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(annonceService.update).toHaveBeenCalledWith(annonce);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCategorieById', () => {
        it('Should return tracked Categorie primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategorieById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});

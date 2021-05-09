import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CommentaireDetailComponent } from './commentaire-detail.component';

describe('Component Tests', () => {
  describe('Commentaire Management Detail Component', () => {
    let comp: CommentaireDetailComponent;
    let fixture: ComponentFixture<CommentaireDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CommentaireDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ commentaire: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CommentaireDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CommentaireDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load commentaire on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.commentaire).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

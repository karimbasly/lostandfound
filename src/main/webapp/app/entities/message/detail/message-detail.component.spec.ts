import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MessageDetailComponent } from './message-detail.component';

describe('Component Tests', () => {
  describe('Message Management Detail Component', () => {
    let comp: MessageDetailComponent;
    let fixture: ComponentFixture<MessageDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MessageDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ message: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MessageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MessageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load message on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.message).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});

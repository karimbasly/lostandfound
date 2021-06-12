import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceItemComponent } from './annonce-item.component';

describe('AnnonceItemComponent', () => {
  let component: AnnonceItemComponent;
  let fixture: ComponentFixture<AnnonceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnonceItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnonceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

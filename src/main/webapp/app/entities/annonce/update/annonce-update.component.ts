import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAnnonce, Annonce } from '../annonce.model';
import { AnnonceService } from '../service/annonce.service';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';

@Component({
  selector: 'jhi-annonce-update',
  templateUrl: './annonce-update.component.html',
})
export class AnnonceUpdateComponent implements OnInit {
  isSaving = false;

  categoriesSharedCollection: ICategorie[] = [];

  editForm = this.fb.group({
    id: [],
    titre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    description: [null, [Validators.minLength(3), Validators.maxLength(255)]],
    ville: [],
    type: [],
    etat: [],
    dateAnnonce: [null, [Validators.required]],
    categorie: [],
  });

  constructor(
    protected annonceService: AnnonceService,
    protected categorieService: CategorieService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ annonce }) => {
      if (annonce.id === undefined) {
        const today = dayjs().startOf('day');
        annonce.dateAnnonce = today;
      }

      this.updateForm(annonce);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const annonce = this.createFromForm();
    if (annonce.id !== undefined) {
      this.subscribeToSaveResponse(this.annonceService.update(annonce));
    } else {
      this.subscribeToSaveResponse(this.annonceService.create(annonce));
    }
  }

  trackCategorieById(index: number, item: ICategorie): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnnonce>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(annonce: IAnnonce): void {
    this.editForm.patchValue({
      id: annonce.id,
      titre: annonce.titre,
      description: annonce.description,
      ville: annonce.ville,
      type: annonce.type,
      etat: annonce.etat,
      dateAnnonce: annonce.dateAnnonce ? annonce.dateAnnonce.format(DATE_TIME_FORMAT) : null,
      categorie: annonce.categorie,
    });

    this.categoriesSharedCollection = this.categorieService.addCategorieToCollectionIfMissing(
      this.categoriesSharedCollection,
      annonce.categorie
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categorieService
      .query()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategorie[]) =>
          this.categorieService.addCategorieToCollectionIfMissing(categories, this.editForm.get('categorie')!.value)
        )
      )
      .subscribe((categories: ICategorie[]) => (this.categoriesSharedCollection = categories));
  }

  protected createFromForm(): IAnnonce {
    return {
      ...new Annonce(),
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      description: this.editForm.get(['description'])!.value,
      ville: this.editForm.get(['ville'])!.value,
      type: this.editForm.get(['type'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      dateAnnonce: this.editForm.get(['dateAnnonce'])!.value
        ? dayjs(this.editForm.get(['dateAnnonce'])!.value, DATE_TIME_FORMAT)
        : undefined,
      categorie: this.editForm.get(['categorie'])!.value,
    };
  }
}

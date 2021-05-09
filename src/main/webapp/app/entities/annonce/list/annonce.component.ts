import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnnonce } from '../annonce.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AnnonceService } from '../service/annonce.service';
import { AnnonceDeleteDialogComponent } from '../delete/annonce-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-annonce',
  templateUrl: './annonce.component.html',
})
export class AnnonceComponent implements OnInit {
  annonces: IAnnonce[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected annonceService: AnnonceService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.annonces = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.annonceService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IAnnonce[]>) => {
          this.isLoading = false;
          this.paginateAnnonces(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.annonces = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnnonce): number {
    return item.id!;
  }

  delete(annonce: IAnnonce): void {
    const modalRef = this.modalService.open(AnnonceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.annonce = annonce;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateAnnonces(data: IAnnonce[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.annonces.push(d);
      }
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { AnnonceService } from 'app/entities/annonce/service/annonce.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Annonce, IAnnonce } from 'app/entities/annonce/annonce.model';

import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  annonces: IAnnonce[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private annonceService: AnnonceService,
    protected parseLinks: ParseLinks
  ) {
    this.annonces = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.loadAll();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
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

  trackId(index: number, item: IAnnonce): number {
    return item.id!;
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

  public searchAnnonces(key: string): void {
    const results: Annonce[] = [];
    for (const Annonce of this.annonces) {
      if (
        Annonce.titre?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Annonce.description?.toLowerCase().indexOf(key.toLowerCase()) !== -1 ||
        Annonce.ville?.toLowerCase().indexOf(key.toLowerCase()) !== -1
      ) {
        results.push(Annonce);
      }
    }
    this.annonces = results;
    if (results.length === 0 || !key) {
      this.annonces = [];
      this.loadAll();
    }
  }
}

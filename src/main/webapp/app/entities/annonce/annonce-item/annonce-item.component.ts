import { Component, Input, OnInit } from '@angular/core';
import { IAnnonce } from 'app/entities/annonce/annonce.model';
import { AnnonceService } from 'app/entities/annonce/service/annonce.service';

@Component({
  selector: 'jhi-annonce-item',
  templateUrl: './annonce-item.component.html',
  styleUrls: ['./annonce-item.component.scss'],
})
export class AnnonceItemComponent implements OnInit {
  @Input() annonce: IAnnonce;
  constructor(protected annonceService: AnnonceService) {
    this.annonce = {};
  }

  ngOnInit(): void {
    // do nothing
  }
}

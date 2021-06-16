import { Component, Input, OnInit } from '@angular/core';
import { IAnnonce } from 'app/entities/annonce/annonce.model';
import { AnnonceService } from 'app/entities/annonce/service/annonce.service';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-annonce-item',
  templateUrl: './annonce-item.component.html',
  styleUrls: ['./annonce-item.component.scss'],
})
export class AnnonceItemComponent implements OnInit {
  @Input() annonce: IAnnonce;
  constructor(protected dataUtils: DataUtils, protected annonceService: AnnonceService) {
    this.annonce = {};
  }

  ngOnInit(): void {
    // do nothing
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }
}

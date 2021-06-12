import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { AnnonceModule } from 'app/entities/annonce/annonce.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE]), AnnonceModule],
  declarations: [HomeComponent],
})
export class HomeModule {}

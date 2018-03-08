import { TextMaskModule } from 'angular2-text-mask';
import { FormsModule } from '@angular/forms';
import { HelperModule } from './../helper/helper.module';
import { ClarityModule } from '@clr/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustProductModalComponent } from './adjust-product/adjust-product.component';
import { PackageModalComponent } from './package-modal/package-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/chage-password-modal.component';
import { AddLotsModalComponent } from 'app/modals/add-lots-modal/add-lots-modal.component';
import { LocationModalComponent } from 'app/modals/location-modal/location-modal.component';
import { LocationService } from 'app/admin/location.service';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    HelperModule,
    FormsModule,
    TextMaskModule
  ],
  declarations: [
    LocationModalComponent,
    AdjustProductModalComponent,
    PackageModalComponent,
    ChangePasswordModalComponent,
    AddLotsModalComponent,
    LoadingModalComponent,
  ],
  exports: [
    LocationModalComponent,
    AdjustProductModalComponent,
    PackageModalComponent,
    ChangePasswordModalComponent,
    AddLotsModalComponent,
    LoadingModalComponent
  ],
  providers: [LocationService]
})
export class ModalsModule { }

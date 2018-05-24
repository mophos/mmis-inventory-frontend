import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelperModule } from 'app/helper/helper.module';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ChartModule } from 'angular2-highcharts';
import { AuthModule } from 'angular2-jwt';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { GridDetailModule } from 'app/grid-detail/grid-detail.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ModalsModule } from 'app/modals/modals.module';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { DirectivesModule } from 'app/directives/directives.module';
import { RequisitionNewComponent } from 'app/admin/requisition/requisition-new/requisition-new.component';
import { RequisitionTypeComponent } from 'app/admin/requisition/requisition-type/requisition-type.component';
import { RequisitionTemplateComponent } from 'app/admin/requisition/requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from 'app/admin/requisition/requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from 'app/admin/requisition/requisition-template-edit/requisition-template-edit.component';
import { RequisitionConfirmComponent } from 'app/admin/requisition/requisition-confirm/requisition-confirm.component';
import { RequisitionConfirmUnpaidComponent } from 'app/admin/requisition/requisition-confirm-unpaid/requisition-confirm-unpaid.component';
import { RequisitionConfirmEditComponent } from 'app/admin/requisition/requisition-confirm-edit/requisition-confirm-edit.component';
import { RequisitionComponent } from './requisition.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HelperModule,
    RouterModule,
    FormsModule,
    ClarityModule,
    ChartModule,
    MyDatePickerTHModule,
    GridDetailModule,
    TextMaskModule,
    ModalsModule,
    AgxTypeaheadModule,
    DirectivesModule,
  ],
  declarations: [
    RequisitionComponent,
    RequisitionNewComponent,
    RequisitionTypeComponent,
    RequisitionTemplateComponent,
    RequisitionTemplateNewComponent,
    RequisitionTemplateEditComponent,
    RequisitionConfirmComponent,
    RequisitionConfirmUnpaidComponent,
    RequisitionConfirmEditComponent,
  ]
})
export class RequisitionModule { }

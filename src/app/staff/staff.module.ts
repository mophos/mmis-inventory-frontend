import { PayRequisitionService } from './pay-requisition.service';
import { TransferService } from './transfer.service';
import { GridDetailModule } from './../grid-detail/grid-detail.module';
import { ModalsModule } from './../modals/modals.module';
import { StaffService } from './staff.service';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { StaffGuard } from './../staff-guard';
import { FormsModule } from '@angular/forms';
import { ToThaiDatePipe } from './../helper/to-thai-date.pipe';
import { HelperModule } from './../helper/helper.module';
import { ClarityModule } from '@clr/angular';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { MainComponent } from './main/main.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { RequisitionNewComponent } from './requisition-new/requisition-new.component';

import { LocationService } from './location.service';

import { MainService } from './main.service';
import { AlertService } from '../alert.service';
import { WarehouseTypeService } from './warehouse-type.service';
import { WarehouseService } from './warehouse.service';
import { ReceiveService } from "./receive.service";
import { LabelerService } from "./labeler.service";
import { RequisitionTypeService } from "./requisition-type.service";
import { RequisitionService } from "./requisition.service";
import { UnitissueService } from "./unitissue.service";
import { AlertExpiredService } from './alert-expired.service';
import { ProductlotsService } from "./productlots.service";
import { BorrowService } from './borrow.service';
import { UploadingService } from './../uploading.service';
import { IssueService } from './issue.service';
import { CountingComponent } from './counting/counting.component';
import { TransferComponent } from './transfer/transfer.component';
import { TransferNewComponent } from './transfer-new/transfer-new.component';

import { DirectivesModule } from '../directives/directives.module';
import { TextMaskModule } from 'angular2-text-mask';

import { WarehouseProductsService } from './warehouse-products.service';

// requisition template
import { RequisitionTemplateComponent } from './requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from './requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from './requisition-template-edit/requisition-template-edit.component';

import { ProductsService } from './products.service';
import { HisMappingsComponent } from 'app/staff/his-mappings/his-mappings.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';
import { IssueTransactionComponent } from './issue-transaction/issue-transaction.component';
import { IssueTransactionNewComponent } from './issue-transaction-new/issue-transaction-new.component';
import { IssueTransactionEditComponent } from './issue-transaction-edit/issue-transaction-edit.component';

import { IssueTransactionService } from 'app/staff/issue-transaction.service';
import { PlanningComponent } from './planning/planning.component';
import { HisIssueTransactionComponent } from './his-issue-transaction/his-issue-transaction.component';
import { HisTransactionService } from 'app/staff/his-transaction.service';
import { AccessCheck } from '../access-check';
import { PeriodService } from 'app/staff/period.service';
import { ProductsComponent } from './products/products.component';
import { BorrowNoteService } from './borrow-note.service';
import { BorrowNoteNewComponent } from './borrow-note-new/borrow-note-new.component';
import { BorrowNoteComponent } from './borrow-note/borrow-note.component';
import { ProductRequisitionComponent } from './product-requisition/product-requisition.component';
import { AdjustStockComponent } from './adjust-stock/adjust-stock.component';
import { AdjustStockNewComponent } from './adjust-stock-new/adjust-stock-new.component';
import { StockCardComponent } from './report/stock-card/stock-card.component';
import { ReceivesComponent } from './receives/receives.component';
import { ReceivesOtherComponent } from './receives-other/receives-other.component';
import { ReceivesOtherEditComponent } from './receives-other-edit/receives-other-edit.component';
import { ExportdataComponent } from './exportdata/exportdata.component';
import { PayRequisitionComponent } from './pay-requisition/pay-requisition.component';
import { PayRequisitionConfirmComponent } from './pay-requisition-confirm/pay-requisition-confirm.component';
import { ValueReceiveOtherComponent } from './report/value-receive-other/value-receive-other.component';
import { BorrowComponent } from './borrow/borrow.component';
import { BorrowNewComponent } from './borrow-new/borrow-new.component';
import { BorrowEditComponent } from './borrow-edit/borrow-edit.component';
import { BorrowotherEditComponent } from './borrowother-edit/borrowother-edit.component';
import { BorrowotherNewComponent } from './borrowother-new/borrowother-new.component';
import { BorrowItemsService } from './borrow-items.service';
import { ReturnedComponent } from './returned/returned.component';
import { ReturnedEditComponent } from './returned-edit/returned-edit.component';
import { IssueTemplateNewComponent } from './issue-template-new/issue-template-new.component';
@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    HttpModule,
    HelperModule,
    StaffRoutingModule,
    DirectivesModule,
    MyDatePickerTHModule,
    ModalsModule,
    TextMaskModule,
    GridDetailModule
  ],
  declarations: [
    LayoutComponent,
    MainComponent,
    RequisitionComponent,
    RequisitionNewComponent,
    CountingComponent,
    TransferComponent,
    RequisitionTemplateComponent,
    RequisitionTemplateNewComponent,
    RequisitionTemplateEditComponent,
    TransferNewComponent,
    HisMappingsComponent,
    TransferEditComponent,
    IssueTransactionComponent,
    IssueTransactionNewComponent,
    IssueTransactionEditComponent,
    PlanningComponent,
    HisIssueTransactionComponent,
    ProductsComponent,
    BorrowNoteComponent,
    BorrowNoteNewComponent,
    ProductRequisitionComponent,
    AdjustStockComponent,
    AdjustStockNewComponent,
    StockCardComponent,
    ReceivesComponent,
    ReceivesOtherComponent,
    ReceivesOtherEditComponent,
    ExportdataComponent,
    PayRequisitionComponent,
    PayRequisitionConfirmComponent,
    ValueReceiveOtherComponent,
    BorrowComponent,
    BorrowNewComponent,
    BorrowEditComponent,
    BorrowotherEditComponent,
    BorrowotherNewComponent,
    ReturnedComponent,
    ReturnedEditComponent,
    IssueTemplateNewComponent
  ],
  providers: [
    ToThaiDatePipe,
    StaffGuard,
    StaffService,
    MainService,
    AlertService,
    WarehouseTypeService,
    WarehouseService,
    LocationService,
    ReceiveService,
    LabelerService,
    RequisitionTypeService,
    RequisitionService,
    UnitissueService,
    ProductlotsService,
    ToThaiDatePipe,
    AlertExpiredService,
    WarehouseProductsService,
    BorrowService,
    UploadingService,
    IssueService,
    TransferService,
    ProductsService,
    IssueTransactionService,
    HisTransactionService,
    PeriodService,
    AccessCheck,
    BorrowNoteService,
    PayRequisitionService,
    BorrowItemsService
  ]
})
export class StaffModule { }

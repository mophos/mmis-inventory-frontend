import { MinMaxService } from './min-max.service';
import { TransectionTypeService } from './transection-type.service';
import { ReceiveotherTypeService } from './receiveother-type.service';
import { YearThaiPipe } from 'app/helper/year-thai.pipe';
import { MonthToThPipe } from 'app/helper/month-to-th.pipe';
import { MonthDateperiodPipe } from 'app/helper/month-dateperiod.pipe';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { PeriodComponent } from './period/period.component';

import '@clr/icons';
import '@clr/icons/shapes/all-shapes';

import { PackageService } from './packages.service';
import { CountingComponent } from './counting/counting.component';
import { CountingService } from './counting.service';
import { ProductsService } from './products.service';
import { DonatorService } from './donator.service';
import { ModalsModule } from './../modals/modals.module';
import { DateService } from './../date.service';
import { LotService } from './lot.service';
import { GridDetailModule } from './../grid-detail/grid-detail.module';
import { ProductionUnitService } from './production-units.service';
import { TransferService } from './transfer.service';
import { TextMaskModule } from 'angular2-text-mask';

declare var require: any; // highcharts

import { AdminGuard } from './../admin-guard';
import { UploadingService } from './../uploading.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { MyDatePickerTHModule } from 'mydatepicker-th';

import { AdminRoutingModule } from './admin-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { HelperModule } from '../helper/helper.module';
import { AuthModule } from '../auth/auth.module';

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
import { AbcVenService } from './abc-ven.service';
import { BorrowService } from './borrow.service';
import { ReportProductsService } from './reports/reports-products.service';
import { WarehouseProductsService } from './warehouse-products.service';
import { ShippingNetworkService } from './shipping-network.service';
import { IssueService } from './issue.service';
import { AdditionService } from 'app/admin/addition.service';

import { LayoutComponent } from './layout/layout.component';
import { WarehouseTypeComponent } from './warehouse-type/warehouse-type.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ReceiveComponent } from './receive/receive.component';
import { ReceivePurchaseComponent } from './receive-purchase/receive-purchase.component';
import { WarehouseDetailComponent } from './warehouse-detail/warehouse-detail.component';

// import common component
import { AlertExpiredComponent } from './alert-expired/alert-expired.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { RequisitionNewComponent } from './requisition-new/requisition-new.component';

import { UnitissueComponent } from './unitissue/unitissue.component';

// import { ReceiveCheckComponent } from './receive-check/receive-check.component';
import { RequisitionTypeComponent } from './requisition-type/requisition-type.component';
import { ToThaiDatePipe } from '../helper/to-thai-date.pipe';
import { AbcVenComponent } from './abc-ven/abc-ven.component';
import { AbcSettingComponent } from './abc-setting/abc-setting.component';
import { VenSettingComponent } from './ven-setting/ven-setting.component';
import { ReturningComponent } from './returning/returning.component';
import { ProductRemainComponent } from './reports/product-remain/product-remain.component';
import { ReceivesComponent } from './reports/receives/receives.component';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TransferComponent } from './transfer/transfer.component';
import { TransferNewComponent } from './transfer-new/transfer-new.component';
import { DonatorsComponent } from './donators/donators.component';
import { ProductsComponent } from './products/products.component';
import { ProductExpiredComponent } from './reports/product-expired/product-expired.component';
import { CountingNewComponent } from './counting-new/counting-new.component';
import { CountingVerifyComponent } from './counting-verify/counting-verify.component';
import { CountingAdjustComponent } from './counting-adjust/counting-adjust.component';
import { RequisitionTemplateComponent } from './requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from './requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from './requisition-template-edit/requisition-template-edit.component';
import { WarehouseProductsComponent } from './warehouse-products/warehouse-products.component';
import { WarehouseProductsDetailComponent } from './warehouse-products-detail/warehouse-products-detail.component';
import { ShippingNetworkComponent } from './shipping-network/shipping-network.component';

import { DirectivesModule } from '../directives/directives.module';
import { ReceiveOtherComponent } from "app/admin/receive-other/receive-other.component";
import { ReceiveEditComponent } from "app/admin/receive-edit/receive-edit.component";
import { HisMappingsComponent } from './his-mappings/his-mappings.component';
import { IssuesComponent } from './issues/issues.component';
import { IssuesNewComponent } from './issues-new/issues-new.component';
import { ReceivePlanningComponent } from './receive-planning/receive-planning.component';
import { ReceivePlanningNewComponent } from './receive-planning-new/receive-planning-new.component';
import { ReceivePlanningEditComponent } from './receive-planning-edit/receive-planning-edit.component';
import { ReceiveOtherEditComponent } from './receive-other-edit/receive-other-edit.component';
import { IssuesEditComponent } from './issues-edit/issues-edit.component';
import { TransferEditComponent } from './transfer-edit/transfer-edit.component';
import { HisIssueTransactionComponent } from './his-issue-transaction/his-issue-transaction.component';
import { HisTransactionService } from 'app/admin/his-transaction.service';
import { TransectionTypeComponent } from './transection-type/transection-type.component';
import { ReceiveotherTypeComponent } from './receiveother-type/receiveother-type.component';
import { WarehouseProductPlanningComponent } from './warehouse-product-planning/warehouse-product-planning.component';

import { RequisitionConfirmComponent } from 'app/admin/requisition-confirm/requisition-confirm.component';
import { RequisitionConfirmUnpaidComponent } from 'app/admin/requisition-confirm-unpaid/requisition-confirm-unpaid.component';
import { AuthReceive } from 'app/auth-receive.service';
import { AuthTransfer } from 'app/auth-transfer.service';
import { AuthRequisition } from 'app/auth-requisition.service';
import { AuthShippingNetwork } from 'app/auth-shipping-network.service';
import { AuthHISTransaction } from 'app/auth-his-transaction.service';
import { AuthHISMapping } from 'app/auth-his-mapping.service';
import { AuthWarehouseManagement } from 'app/auth-warehouse-management.service';
import { AuthMinMaxPlanning } from 'app/auth-minmax-planing.service';
import { ProductManufactureComponent } from './reports/product-manufacture/product-manufacture.component';
import { AccessCheck } from '../access-check';
import { StockCardComponent } from './reports/stock-card/stock-card.component';
import { BorrowNoteComponent } from './borrow-note/borrow-note.component';
import { BorrowNoteNewComponent } from './borrow-note-new/borrow-note-new.component';
import { BorrowNoteService } from './borrow-note.service';
import { RequisitionConfirmEditComponent } from './requisition-confirm-edit/requisition-confirm-edit.component';
import { CalculateMinMaxComponent } from 'app/admin/calculate-min-max/calculate-min-max.component';
import { ValueProductsComponent } from './reports/value-products/value-products.component';
import { ProductSummaryComponent } from './reports/product-summary/product-summary.component';
import { PurchasingNotgiveawayComponent } from './reports/purchasing-notgiveaway/purchasing-notgiveaway.component';
import { InventoryStatusComponent } from './reports/inventory-status/inventory-status.component';
import { ProductReceiveComponent } from './reports/product-receive/product-receive.component';
import { SummaryDisbursementComponent } from './reports/summary-disbursement/summary-disbursement.component';
import { CodeMappingComponent } from './code-mapping/code-mapping.component';
import { AdditionComponent } from './addition/addition.component';
import { AdditionWarehouseComponent } from './addition-warehouse/addition-warehouse.component';
import { AdditionEditComponent } from './addition-edit/addition-edit.component';
import { AdditionGenericComponent } from './addition-generic/addition-generic.component';

export function highchartsFactory() {
  return require('highcharts');
}

const Highcharts = require('highcharts');

Highcharts.setOptions({
  credits: false
});

@NgModule({
  imports: [
    CommonModule,
    HelperModule,
    FormsModule,
    ClarityModule,
    ChartModule,
    AuthModule,
    MyDatePickerTHModule,
    GridDetailModule,
    TextMaskModule,
    ModalsModule,
    AgxTypeaheadModule,
    DirectivesModule,
    AdminRoutingModule,
  ],
  declarations: [
    MainPageComponent,
    LayoutComponent,
    WarehouseTypeComponent,
    WarehouseComponent,
    WarehouseDetailComponent,
    ReceiveComponent,
    ReceivePurchaseComponent,
    AlertExpiredComponent,
    RequisitionComponent,
    RequisitionNewComponent,
    UnitissueComponent,
    // ReceiveCheckComponent,
    RequisitionTypeComponent,
    AbcVenComponent,
    AbcSettingComponent,
    VenSettingComponent,
    ReturningComponent,
    ProductRemainComponent,
    ReceivesComponent,
    TransferComponent,
    TransferNewComponent,
    TransectionTypeComponent,
    // ReceivePurchasesComponent,
    // LotsComponent,
    DonatorsComponent,
    ProductsComponent,
    ProductExpiredComponent,
    CountingComponent,
    CountingNewComponent,
    CountingVerifyComponent,
    CountingAdjustComponent,
    RequisitionTemplateComponent,
    RequisitionTemplateNewComponent,
    RequisitionTemplateEditComponent,
    WarehouseProductsComponent,
    WarehouseProductsDetailComponent,
    ShippingNetworkComponent,
    ReceiveOtherComponent,
    ReceiveEditComponent,
    HisMappingsComponent,
    IssuesComponent,
    IssuesNewComponent,
    ReceivePlanningComponent,
    ReceivePlanningNewComponent,
    ReceivePlanningEditComponent,
    ReceiveOtherEditComponent,
    IssuesEditComponent,
    TransferEditComponent,
    PeriodComponent,
    HisIssueTransactionComponent,
    TransectionTypeComponent,
    ReceiveotherTypeComponent,
    WarehouseProductPlanningComponent,
    RequisitionConfirmComponent,
    RequisitionConfirmUnpaidComponent,
    ProductManufactureComponent,
    StockCardComponent,
    BorrowNoteComponent,
    BorrowNoteNewComponent,
    RequisitionConfirmEditComponent,
    CalculateMinMaxComponent,
    ValueProductsComponent,
    ProductSummaryComponent,
    PurchasingNotgiveawayComponent,
    InventoryStatusComponent,
    ProductReceiveComponent,
    SummaryDisbursementComponent,
<<<<<<< HEAD
    CodeMappingComponent
=======
    AdditionComponent,
    AdditionWarehouseComponent,
    AdditionEditComponent,
    AdditionGenericComponent
>>>>>>> 7e8b54d29e992c57affb19325ff23a726aabf822
  ],
  providers: [
    MainService,
    AlertService,
    WarehouseTypeService,
    WarehouseService,
    ReceiveService,
    LabelerService,
    RequisitionTypeService,
    RequisitionService,
    UnitissueService,
    ProductlotsService,
    AdminGuard,
    AuthReceive,
    AuthTransfer,
    AuthRequisition,
    AuthShippingNetwork,
    AuthHISTransaction,
    AuthWarehouseManagement,
    AuthHISMapping,
    AuthMinMaxPlanning,
    ToThaiDatePipe,
    AlertExpiredService,
    AbcVenService,
    BorrowService,
    TransferService,
    UploadingService,
    ReportProductsService,
    ProductionUnitService,
    LotService,
    DateService,
    DonatorService,
    ProductsService,
    CountingService,
    PackageService,
    WarehouseProductsService,
    ShippingNetworkService,
    IssueService,
    MonthToThPipe,
    MonthDateperiodPipe,
    YearThaiPipe,
    HisTransactionService,
    TransectionTypeService,
    ReceiveotherTypeService,
    AccessCheck,
    BorrowNoteService,
    MinMaxService,
    AdditionService,
    { provide: HighchartsStatic, useFactory: highchartsFactory }
  ]
})
export class AdminModule { }

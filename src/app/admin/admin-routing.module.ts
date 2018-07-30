import { AdjustStockNewComponent } from './adjust-stock-new/adjust-stock-new.component';
import { AdjustStockComponent } from './adjust-stock/adjust-stock.component';
import { AdditionEditComponent } from './addition-edit/addition-edit.component';
import { AdditionComponent } from './addition/addition.component';
import { CalculateMinMaxComponent } from './calculate-min-max/calculate-min-max.component';
import { TransectionTypeComponent } from './transection-type/transection-type.component';
import { ReceiveotherTypeComponent } from './receiveother-type/receiveother-type.component';
import { PeriodComponent } from './period/period.component';
import { ShippingNetworkComponent } from './shipping-network/shipping-network.component';
import { CountingAdjustComponent } from './counting-adjust/counting-adjust.component';
import { CountingVerifyComponent } from './counting-verify/counting-verify.component';
import { CountingNewComponent } from './counting-new/counting-new.component';
import { CountingComponent } from './counting/counting.component';
import { ProductExpiredComponent } from './reports/product-expired/product-expired.component';
import { ProductsComponent } from './products/products.component';
import { DonatorsComponent } from './donators/donators.component';
import { TransferNewComponent } from './transfer-new/transfer-new.component';
import { TransferComponent } from './transfer/transfer.component';
import { AdminGuard } from './../admin-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
// pages
import { MainPageComponent } from './main-page/main-page.component';
import { WarehouseTypeComponent } from './warehouse-type/warehouse-type.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ReceiveComponent } from './receive/receive.component';
import { ReceivePurchaseComponent } from './receive-purchase/receive-purchase.component';

import { WarehouseDetailComponent } from './warehouse-detail/warehouse-detail.component';
import { AbcSettingComponent } from './abc-setting/abc-setting.component';
import { VenSettingComponent } from './ven-setting/ven-setting.component';
import { AbcVenComponent } from './abc-ven/abc-ven.component';
import { WarehouseProductsComponent } from './warehouse-products/warehouse-products.component';
import { WarehouseProductsDetailComponent } from './warehouse-products-detail/warehouse-products-detail.component';

// common page
import { AlertExpiredComponent } from './alert-expired/alert-expired.component';
import { UnitissueComponent } from './unitissue/unitissue.component';
import { ReturningComponent } from './returning/returning.component';

// reports
import { ProductRemainComponent as ReportProductRemain } from './reports/product-remain/product-remain.component';
import { ReceivesComponent as ReportReceives } from './reports/receives/receives.component';
import { StockCardComponent } from './reports/stock-card/stock-card.component';

// receive other
import { ReceiveOtherComponent } from './receive-other/receive-other.component';
import { ReceiveEditComponent } from 'app/admin/receive-edit/receive-edit.component';

// his mapping
import { HisMappingsComponent } from './his-mappings/his-mappings.component';

import { IssuesComponent } from 'app/admin/issues/issues.component';
import { IssuesNewComponent } from 'app/admin/issues-new/issues-new.component';

import { ReceivePlanningComponent } from 'app/admin/receive-planning/receive-planning.component';
import { ReceivePlanningNewComponent } from 'app/admin/receive-planning-new/receive-planning-new.component';
import { ReceivePlanningEditComponent } from 'app/admin/receive-planning-edit/receive-planning-edit.component';
import { ReceiveOtherEditComponent } from 'app/admin/receive-other-edit/receive-other-edit.component';
import { IssuesEditComponent } from 'app/admin/issues-edit/issues-edit.component';
import { TransferEditComponent } from 'app/admin/transfer-edit/transfer-edit.component';
import { HisIssueTransactionComponent } from 'app/admin/his-issue-transaction/his-issue-transaction.component';
import { WarehouseProductPlanningComponent } from 'app/admin/warehouse-product-planning/warehouse-product-planning.component';

import { AuthReceive } from 'app/auth-receive.service';
import { AuthTransfer } from 'app/auth-transfer.service';
import { AuthRequisition } from 'app/auth-requisition.service';
import { AuthPeriod } from 'app/auth-period.service';
import { AuthShippingNetwork } from 'app/auth-shipping-network.service';
import { AuthHISTransaction } from 'app/auth-his-transaction.service';
import { AuthHISMapping } from 'app/auth-his-mapping.service';
import { AuthWarehouseManagement } from 'app/auth-warehouse-management.service';
import { AuthAdjustService } from 'app/auth-adjust.service';
import { ProductManufactureComponent } from 'app/admin/reports/product-manufacture/product-manufacture.component';
import { ValueProductsComponent } from 'app/admin/reports/value-products/value-products.component';
import { PurchasingNotgiveawayComponent } from 'app/admin/reports/purchasing-notgiveaway/purchasing-notgiveaway.component'
import { InventoryStatusComponent } from 'app/admin/reports/inventory-status/inventory-status.component';
import { BorrowNoteComponent } from 'app/admin/borrow-note/borrow-note.component';
import { BorrowNoteNewComponent } from 'app/admin/borrow-note-new/borrow-note-new.component';
import { ProductSummaryComponent } from 'app/admin/reports/product-summary/product-summary.component';
import { ProductReceiveComponent } from 'app/admin/reports/product-receive/product-receive.component';
import { SummaryDisbursementComponent } from './reports/summary-disbursement/summary-disbursement.component';
import { CodeMappingComponent } from './code-mapping/code-mapping.component';
import { AdditionWarehouseComponent } from './addition-warehouse/addition-warehouse.component';
import { AdditionGenericComponent } from './addition-generic/addition-generic.component';
import { ReceiveNotMatchPoComponent } from './reports/receive-not-match-po/receive-not-match-po.component';
import { ValueReceiveOtherComponent } from './reports/value-receive-other/value-receive-other.component';
// requisition
import { RequisitionComponent } from 'app/admin/requisition/requisition.component';
import { RequisitionFastComponent } from 'app/admin/requisition/requisition-fast/requisition-fast.component';
import { RequisitionNewComponent } from 'app/admin/requisition-new/requisition-new.component';
import { RequisitionConfirmComponent } from 'app/admin/requisition-confirm/requisition-confirm.component';
import { RequisitionConfirmEditComponent } from 'app/admin/requisition-confirm-edit/requisition-confirm-edit.component';
import { RequisitionConfirmUnpaidComponent } from 'app/admin/requisition-confirm-unpaid/requisition-confirm-unpaid.component';
import { RequisitionTemplateComponent } from 'app/admin/requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from 'app/admin/requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from 'app/admin/requisition-template-edit/requisition-template-edit.component';
import { RequisitionTypeComponent } from 'app/admin/requisition-type/requisition-type.component';
// tool // stockcard
import { StockcardComponent } from './tools/stockcard/stockcard.component';
import { StockcardReceiveComponent } from './tools/stockcard-receive/stockcard-receive.component';
import { StockcardReceiveOtherComponent } from './tools/stockcard-receive-other/stockcard-receive-other.component';
import { StockcardRequisitionComponent } from './tools/stockcard-requisition/stockcard-requisition.component';
const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'main', component: MainPageComponent },
      { path: 'warehouse', canActivate: [AuthWarehouseManagement], component: WarehouseComponent },
      { path: 'adjust-stock', canActivate: [AuthAdjustService], component: AdjustStockComponent },
      { path: 'adjust-stock/new', canActivate: [AuthAdjustService], component: AdjustStockNewComponent },
      { path: 'warehouse/detail', canActivate: [AuthWarehouseManagement], component: WarehouseDetailComponent },
      { path: 'warehouse/planning', canActivate: [AuthWarehouseManagement], component: WarehouseProductPlanningComponent },
      { path: 'warehouse-type', component: WarehouseTypeComponent },
      { path: 'abc-setting', component: AbcSettingComponent },
      { path: 'ven-setting', component: VenSettingComponent },
      { path: 'abc-ven', component: AbcVenComponent },
      { path: 'period', canActivate: [AuthPeriod], component: PeriodComponent },
      { path: 'receives', canActivate: [AuthReceive], component: ReceiveComponent },
      { path: 'receives/purchase', canActivate: [AuthReceive], component: ReceivePurchaseComponent },
      { path: 'receives/other', canActivate: [AuthReceive], component: ReceiveOtherComponent },
      { path: 'receives/other/edit', canActivate: [AuthReceive], component: ReceiveOtherEditComponent },
      { path: 'receives/edit', canActivate: [AuthReceive], component: ReceiveEditComponent },
      { path: 'transection-type', component: TransectionTypeComponent },
      { path: 'receiveother-type', component: ReceiveotherTypeComponent },
      { path: 'borrow/returning/:borrowId', component: ReturningComponent },
      { path: 'alert-expired', component: AlertExpiredComponent },
      { path: 'unitissue', component: UnitissueComponent },
      { path: 'reports/receives', component: ReportReceives },
      { path: 'reports/product-remain', component: ReportProductRemain },
      { path: 'reports/product-expired', component: ProductExpiredComponent },
      { path: 'reports/product-manufacture', component: ProductManufactureComponent },
      { path: 'reports/value-products', component: ValueProductsComponent },
      { path: 'reports/product-summary', component: ProductSummaryComponent },
      { path: 'reports/stock-card', component: StockCardComponent },
      { path: 'reports/purchasing-notgiveaway', component: PurchasingNotgiveawayComponent },
      { path: 'reports/inventory-status', component: InventoryStatusComponent },
      { path: 'reports/value-receive-other', component: ValueReceiveOtherComponent },
      { path: 'reports/product-receive', component: ProductReceiveComponent },
      { path: 'reports/receive-not-match-po', component: ReceiveNotMatchPoComponent },
      { path: 'reports/summary-disbursement', component: SummaryDisbursementComponent },
      { path: 'transfer', canActivate: [AuthTransfer], component: TransferComponent },
      { path: 'transfer/new', canActivate: [AuthTransfer], component: TransferNewComponent },
      { path: 'transfer/edit', canActivate: [AuthTransfer], component: TransferEditComponent },
      { path: 'warehouse-products', component: WarehouseProductsComponent },
      { path: 'warehouse-products/details/:warehouseId', component: WarehouseProductsDetailComponent },
      { path: 'code-mapping', component: CodeMappingComponent },
      { path: 'donators', component: DonatorsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'counting', component: CountingComponent },
      { path: 'counting/new', component: CountingNewComponent },
      { path: 'counting/verify/:countId', component: CountingVerifyComponent },
      { path: 'counting/adjust/:countId', component: CountingAdjustComponent },
      { path: 'shipping-network', canActivate: [AuthShippingNetwork], component: ShippingNetworkComponent },
      { path: 'his-mapping', canActivate: [AuthHISMapping], component: HisMappingsComponent },
      { path: 'his-issue-transaction', canActivate: [AuthHISTransaction], component: HisIssueTransactionComponent },
      { path: 'issues', component: IssuesComponent },
      { path: 'issues/new', component: IssuesNewComponent },
      { path: 'issues/edit', component: IssuesEditComponent },
      { path: 'receive-planning', component: ReceivePlanningComponent },
      { path: 'receive-planning/new', component: ReceivePlanningNewComponent },
      { path: 'receive-planning/edit/:warehouseId', component: ReceivePlanningEditComponent },
      { path: 'borrow-notes', component: BorrowNoteComponent },
      { path: 'borrow-notes/new', component: BorrowNoteNewComponent },
      { path: 'borrow-notes/:borrowNoteId/edit', component: BorrowNoteNewComponent },
      { path: 'min-max', component: CalculateMinMaxComponent },
      { path: 'addition', component: AdditionComponent },
      { path: 'addition/warehouse', component: AdditionWarehouseComponent },
      { path: 'addition/generic', component: AdditionGenericComponent },
      { path: 'addition/edit/:additionId', component: AdditionEditComponent },
      {
        path: 'tools',
        canActivate: [AdminGuard],
        children: [
          { path: 'stockcard', component: StockcardComponent },
          { path: 'stockcard/receive', component: StockcardReceiveComponent },
          { path: 'stockcard/receive-other', component: StockcardReceiveOtherComponent },
          { path: 'stockcard/requisition', component: StockcardRequisitionComponent },
        ]
      },
      {
        path: 'requisition',
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },
          { path: 'main', canActivate: [AuthRequisition], component: RequisitionComponent },
          { path: 'new', canActivate: [AuthRequisition], component: RequisitionNewComponent },
          { path: 'type', component: RequisitionTypeComponent },
          { path: 'new', canActivate: [AuthRequisition], component: RequisitionNewComponent },
          { path: 'edit/:requisitionId', canActivate: [AuthRequisition], component: RequisitionNewComponent },
          { path: 'confirm', canActivate: [AuthRequisition], component: RequisitionConfirmComponent },
          { path: 'confirm/edit', canActivate: [AuthRequisition], component: RequisitionConfirmEditComponent },
          { path: 'confirm-unpaid', canActivate: [AuthRequisition], component: RequisitionConfirmUnpaidComponent },
          { path: 'templates', canActivate: [AuthRequisition], component: RequisitionTemplateComponent },
          { path: 'templates/new', canActivate: [AuthRequisition], component: RequisitionTemplateNewComponent },
          { path: 'templates/edit/:templateId', canActivate: [AuthRequisition], component: RequisitionTemplateEditComponent },
          { path: 'fast', canActivate: [AuthRequisition], component: RequisitionFastComponent },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

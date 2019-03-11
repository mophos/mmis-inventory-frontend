import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

// common page
import { AlertExpiredComponent } from './alert-expired/alert-expired.component';
import { UnitissueComponent } from './unitissue/unitissue.component';
import { ReturningComponent } from './returning/returning.component';

// reports
import { ReportComponent } from './report/report.component';
import { ProductExpiredComponent } from './reports/product-expired/product-expired.component';
import { ProductRemainComponent as ReportProductRemain } from './reports/product-remain/product-remain.component';
import { ReceivesComponent as ReportReceives } from './reports/receives/receives.component';
import { StockCardComponent } from './reports/stock-card/stock-card.component';
import { ProductManufactureComponent } from 'app/admin/reports/product-manufacture/product-manufacture.component';
import { ValueProductsComponent } from 'app/admin/reports/value-products/value-products.component';
import { PurchasingNotgiveawayComponent } from 'app/admin/reports/purchasing-notgiveaway/purchasing-notgiveaway.component'
import { InventoryStatusComponent } from 'app/admin/reports/inventory-status/inventory-status.component';
import { ProductSummaryComponent } from 'app/admin/reports/product-summary/product-summary.component';
import { ProductReceiveComponent } from 'app/admin/reports/product-receive/product-receive.component';
import { SummaryDisbursementComponent } from './reports/summary-disbursement/summary-disbursement.component';
import { ReceiveNotMatchPoComponent } from './reports/receive-not-match-po/receive-not-match-po.component';
import { ValueReceiveOtherComponent } from './reports/value-receive-other/value-receive-other.component';
import { ReceiveIssueYearComponent } from './reports/receive-issue-year/receive-issue-year.component';

// Auth
import { AdminGuard } from 'app/admin-guard';
import { AuthReceive } from 'app/auth-receive.service';
import { AuthTransfer } from 'app/auth-transfer.service';
import { AuthRequisition } from 'app/auth-requisition.service';
import { AuthPeriod } from 'app/auth-period.service';
import { AuthShippingNetwork } from 'app/auth-shipping-network.service';
import { AuthHISTransaction } from 'app/auth-his-transaction.service';
import { AuthHISMapping } from 'app/auth-his-mapping.service';
import { AuthWarehouseManagement } from 'app/auth-warehouse-management.service';
import { AuthAdjustService } from 'app/auth-adjust.service';
import { AuthMinMaxPlanning } from 'app/auth-minmax-planing.service';
import { AuthAddition } from 'app/auth-addition.service';
import { AuthStockcard } from 'app/auth-stockcard.service';
import { AuthReturnBudget } from '../auth-return-budget.service';
import { AuthPick } from '../auth-pick.service';
// requisition
import { RequisitionComponent } from 'app/admin/requisition/requisition.component';
import { RequisitionFastComponent } from 'app/admin/requisition-fast/requisition-fast.component';
import { RequisitionNewComponent } from 'app/admin/requisition-new/requisition-new.component';
import { RequisitionConfirmComponent } from 'app/admin/requisition-confirm/requisition-confirm.component';
import { RequisitionConfirmEditComponent } from 'app/admin/requisition-confirm-edit/requisition-confirm-edit.component';
import { RequisitionConfirmUnpaidComponent } from 'app/admin/requisition-confirm-unpaid/requisition-confirm-unpaid.component';
import { RequisitionTemplateComponent } from 'app/admin/requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from 'app/admin/requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from 'app/admin/requisition-template-edit/requisition-template-edit.component';
import { RequisitionTypeComponent } from 'app/admin/requisition-type/requisition-type.component';
import { RequisitionMultipleComponent } from 'app/admin/requisition-multiple/requisition-multiple.component';
// tool // stockcard
import { StockcardComponent } from 'app/admin/tools/stockcard/stockcard.component';
import { StockcardReceiveComponent } from 'app/admin/tools/stockcard-receive/stockcard-receive.component';
import { StockcardReceiveOtherComponent } from 'app/admin/tools/stockcard-receive-other/stockcard-receive-other.component';
import { StockcardRequisitionComponent } from 'app/admin/tools/stockcard-requisition/stockcard-requisition.component';
import { StockcardTransferComponent } from 'app/admin/tools/stockcard-transfer/stockcard-transfer.component';
import { StockcardIssueComponent } from 'app/admin/tools/stockcard-issue/stockcard-issue.component';
//
import { BorrowComponent } from './borrow/borrow.component';
import { BorrowNewComponent } from './borrow-new/borrow-new.component';
import { BorrowEditComponent } from './borrow-edit/borrow-edit.component';
import { PickComponent } from './pick/pick.component';
import { PickNewComponent } from './pick-new/pick-new.component';
import { AbcSettingComponent } from 'app/admin/abc-setting/abc-setting.component';
import { AbcVenComponent } from 'app/admin/abc-ven/abc-ven.component';
import { AdjustStockNewComponent } from 'app/admin/adjust-stock-new/adjust-stock-new.component';
import { AdjustStockComponent } from 'app/admin/adjust-stock/adjust-stock.component';
import { AdditionComponent } from 'app/admin/addition/addition.component';
import { AdditionEditComponent } from 'app/admin/addition-edit/addition-edit.component';
import { AdditionGenericComponent } from 'app/admin/addition-generic/addition-generic.component';
import { AdditionWarehouseComponent } from 'app/admin/addition-warehouse/addition-warehouse.component';
import { BorrowNoteComponent } from 'app/admin/borrow-note/borrow-note.component';
import { BorrowNoteNewComponent } from 'app/admin/borrow-note-new/borrow-note-new.component';
import { CalculateMinMaxComponent } from 'app/admin/calculate-min-max/calculate-min-max.component';
import { CodeMappingComponent } from 'app/admin/code-mapping/code-mapping.component';
import { CountingAdjustComponent } from 'app/admin/counting-adjust/counting-adjust.component';
import { CountingComponent } from 'app/admin/counting/counting.component';
import { CountingNewComponent } from 'app/admin/counting-new/counting-new.component';
import { CountingVerifyComponent } from 'app/admin/counting-verify/counting-verify.component';
import { DonatorsComponent } from 'app/admin/donators/donators.component';
import { ExportdataComponent } from 'app/admin/exportdata/exportdata.component';
import { HisIssueTransactionComponent } from 'app/admin/his-issue-transaction/his-issue-transaction.component';
import { HisMappingsComponent } from 'app/admin/his-mappings/his-mappings.component';
import { IssuesComponent } from 'app/admin/issues/issues.component';
import { IssuesEditComponent } from 'app/admin/issues-edit/issues-edit.component';
import { IssuesNewComponent } from 'app/admin/issues-new/issues-new.component';
import { MainPageComponent } from 'app/admin/main-page/main-page.component';
import { PeriodComponent } from 'app/admin/period/period.component';
import { ProductsComponent } from 'app/admin/products/products.component';
import { ReceiveComponent } from 'app/admin/receive/receive.component';
import { ReceiveEditComponent } from 'app/admin/receive-edit/receive-edit.component';
import { ReceiveOtherComponent } from 'app/admin/receive-other/receive-other.component';
import { ReceiveOtherEditComponent } from 'app/admin/receive-other-edit/receive-other-edit.component';
import { ReceiveotherTypeComponent } from 'app/admin/receiveother-type/receiveother-type.component';
import { ReceivePlanningComponent } from 'app/admin/receive-planning/receive-planning.component';
import { ReceivePlanningNewComponent } from 'app/admin/receive-planning-new/receive-planning-new.component';
import { ReceivePurchaseComponent } from 'app/admin/receive-purchase/receive-purchase.component';
import { ReceivePlanningEditComponent } from 'app/admin/receive-planning-edit/receive-planning-edit.component';
import { ReturnBudgetComponent } from 'app/admin/return-budget/return-budget.component';
import { ShippingNetworkComponent } from 'app/admin/shipping-network/shipping-network.component';
import { TransectionTypeComponent } from 'app/admin/transection-type/transection-type.component';
import { TransferComponent } from 'app/admin/transfer/transfer.component';
import { TransferEditComponent } from 'app/admin/transfer-edit/transfer-edit.component';
import { TransferNewComponent } from 'app/admin/transfer-new/transfer-new.component';
import { VenSettingComponent } from 'app/admin/ven-setting/ven-setting.component';
import { WarehouseProductPlanningComponent } from 'app/admin/warehouse-product-planning/warehouse-product-planning.component'
import { WarehouseTypeComponent } from 'app/admin/warehouse-type/warehouse-type.component';
import { WarehouseComponent } from 'app/admin/warehouse/warehouse.component';
import { WarehouseDetailComponent } from 'app/admin/warehouse-detail/warehouse-detail.component';
import { WarehouseProductsComponent } from 'app/admin/warehouse-products/warehouse-products.component';
import { WarehouseProductsDetailComponent } from 'app/admin/warehouse-products-detail/warehouse-products-detail.component';
import { BorrowotherNewComponent } from './borrowother-new/borrowother-new.component';
import { BorrowotherEditComponent } from './borrowother-edit/borrowother-edit.component';
import { ReturnedComponent } from './returned/returned.component';
import { ReturnedEditComponent } from './returned-edit/returned-edit.component';
import { StockcardPickComponent } from './tools/stockcard-pick/stockcard-pick.component';
import { ProductsWarehouseComponent } from './products-warehouse/products-warehouse.component';
import { IssueTemplateNewComponent } from './issue-template-new/issue-template-new.component';
import { MonthlyReportComponent } from './reports/monthly-report/monthly-report.component';
import { PayReportComponent } from './reports/pay-report/pay-report.component';
import { StockcardBorrowComponent } from './tools/stockcard-borrow/stockcard-borrow.component';

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
      { path: 'requisition-type', component: RequisitionTypeComponent },
      { path: 'receiveother-type', component: ReceiveotherTypeComponent },
      { path: 'borrow/returning/:borrowId', component: ReturningComponent },
      { path: 'alert-expired', component: AlertExpiredComponent },
      { path: 'unitissue', component: UnitissueComponent },
      { path: 'exportdata', component: ExportdataComponent },
      { path: 'return-product/new', component: ReturnedComponent },
      { path: 'return-product/edit', component: ReturnedEditComponent },
      {
        path: 'reports',
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },
          { path: 'main', component: ReportComponent },
          { path: 'receives', component: ReportReceives },
          { path: 'product-remain', component: ReportProductRemain },
          { path: 'product-expired', component: ProductExpiredComponent },
          { path: 'product-manufacture', component: ProductManufactureComponent },
          { path: 'value-products', component: ValueProductsComponent },
          { path: 'product-summary', component: ProductSummaryComponent },
          { path: 'stock-card', component: StockCardComponent },
          { path: 'purchasing-notgiveaway', component: PurchasingNotgiveawayComponent },
          { path: 'inventory-status', component: InventoryStatusComponent },
          { path: 'value-receive-other', component: ValueReceiveOtherComponent },
          { path: 'product-receive', component: ProductReceiveComponent },
          { path: 'receive-not-match-po', component: ReceiveNotMatchPoComponent },
          { path: 'summary-disbursement', component: SummaryDisbursementComponent },
          { path: 'receive-issue-year', component: ReceiveIssueYearComponent },
          { path: 'monthly-report', component: MonthlyReportComponent },
          { path: 'pay-report', component: PayReportComponent }
        ]
      },
      { path: 'transfer', canActivate: [AuthTransfer], component: TransferComponent },
      { path: 'transfer/new', canActivate: [AuthTransfer], component: TransferNewComponent },
      { path: 'transfer/edit', canActivate: [AuthTransfer], component: TransferEditComponent },
      { path: 'warehouse-products', component: WarehouseProductsComponent },
      { path: 'warehouse-products/details/:warehouseId', component: WarehouseProductsDetailComponent },
      { path: 'code-mapping', component: CodeMappingComponent },
      { path: 'donators', component: DonatorsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products-warehouse', component: ProductsWarehouseComponent },
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
      { path: 'min-max', canActivate: [AuthMinMaxPlanning], component: CalculateMinMaxComponent },
      { path: 'addition', canActivate: [AuthAddition], component: AdditionComponent },
      { path: 'addition/warehouse', canActivate: [AuthAddition], component: AdditionWarehouseComponent },
      { path: 'addition/generic', canActivate: [AuthAddition], component: AdditionGenericComponent },
      { path: 'addition/edit/:additionId', canActivate: [AuthAddition], component: AdditionEditComponent },
      { path: 'return-budget', canActivate: [AuthReturnBudget], component: ReturnBudgetComponent },
      { path: 'pick', canActivate: [AdminGuard, AuthPick], component: PickComponent },
      { path: 'pick/new', canActivate: [AdminGuard, AuthPick], component: PickNewComponent },
      { path: 'pick/edit/:pickId', canActivate: [AdminGuard, AuthPick], component: PickNewComponent },
      {
        path: 'tools',
        canActivate: [AdminGuard, AuthStockcard],
        children: [
          { path: 'stockcard', component: StockcardComponent },
          { path: 'stockcard/receive', component: StockcardReceiveComponent },
          { path: 'stockcard/receive-other', component: StockcardReceiveOtherComponent },
          { path: 'stockcard/requisition', component: StockcardRequisitionComponent },
          { path: 'stockcard/borrow', component: StockcardBorrowComponent },
          { path: 'stockcard/transfer', component: StockcardTransferComponent },
          { path: 'stockcard/issue', component: StockcardIssueComponent },
          { path: 'stockcard/pick', component: StockcardPickComponent }
        ]
      },
      {
        path: 'borrow',
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'borrow', pathMatch: 'full' },
          { path: 'borrow', component: BorrowComponent },
          { path: 'new', component: BorrowNewComponent },
          { path: 'edit', component: BorrowEditComponent },
          { path: 'other/new', component: BorrowotherNewComponent },
          { path: 'other/edit', component: BorrowotherEditComponent },
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
          // { path: 'templates', component: RequisitionTemplateComponent },
          // { path: 'templates/new', component: RequisitionTemplateNewComponent },
          // { path: 'templates/edit/:templateId', component: RequisitionTemplateEditComponent },
          { path: 'fast', canActivate: [AuthRequisition], component: RequisitionFastComponent },
          { path: 'multiple', canActivate: [AuthRequisition], component: RequisitionMultipleComponent },
        ]
      },
      {
        path: 'templates',
        canActivate: [AdminGuard],
        children: [
          { path: '', redirectTo: 'templates', pathMatch: 'full' },
          { path: 'main', component: RequisitionTemplateComponent },
          { path: 'requisition/new', component: RequisitionTemplateNewComponent },
          { path: 'requisition/edit/:templateId', component: RequisitionTemplateEditComponent },
          { path: 'issue/new', component: IssueTemplateNewComponent },
          { path: 'issue/edit/:templateId', component: IssueTemplateNewComponent },

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

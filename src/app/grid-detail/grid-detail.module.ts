import { HelperModule } from './../helper/helper.module';
import { ClarityModule } from '@clr/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductCheckDetailComponent } from './product-check-detail/product-check-detail.component';
import { RequisitionOrderItemsComponent } from './requisition-order-items/requisition-order-items.component';
import { RequisitionSuccessDetailComponent } from './requisition-success-detail/requisition-success-detail.component';
import { DetailCycleWarehouseRemainComponent } from './detail-cycle-warehouse-remain/detail-cycle-warehouse-remain.component';
import { TransferDetailComponent } from './transfer-detail/transfer-detail.component';
import { TransferDetailStaffComponent } from './transfer-detail-staff/transfer-detail-staff.component';
import { ProductInWarehouseDetailComponent } from './product-in-warehouse-detail/product-in-warehouse-detail.component';
import { ProductInTemplateDetailComponent } from './product-in-template-detail/product-in-template-detail.component';
import { InternalissueDetailComponent } from './internalissue-detail/internalissue-detail.component';
import { ProductReceiveOtherDetailComponent } from './product-receive-other-detail/product-receive-other-detail.component';
import { ProductStockRemainComponent } from './product-stock-remain/product-stock-remain.component';
import { TransactionIssuedetailComponent } from './transaction-issue-detail/transaction-issue-detail.component';
import { TransactionIssueDetailStaffComponent } from './transaction-issue-detail-staff/transaction-issue-detail-staff.component';
import { ConfirmOrderItemsComponent } from 'app/grid-detail/confirm-order-items/confirm-order-items.component';
import { SelectReceiveUnitComponent } from 'app/directives/select-receive-unit/select-receive-unit.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { LoadingModalComponent } from 'app/modals/loading-modal/loading-modal.component';
import { ModalsModule } from 'app/modals/modals.module';
import { RequisitionOrderItemsPayComponent } from 'app/grid-detail/requisition-order-items-pay/requisition-order-items-pay.component';
import { RequisitionOrderUnpaidItemsComponent } from 'app/grid-detail/requisition-order-unpaid-items/requisition-order-unpaid-items.component';
import { StaffRequisitionOrderItemsComponent } from 'app/grid-detail/staff-requisition-order-items/staff-requisition-order-items.component';
import { StaffRequisitionOrderUnpaidItemsComponent } from 'app/grid-detail/staff-requisition-order-unpaid-items/staff-requisition-order-unpaid-items.component';
import { StaffRequisitionOrderItemsPayComponent } from 'app/grid-detail/staff-requisition-order-items-pay/staff-requisition-order-items-pay.component';
import { IssuesComponent } from './issues/issues.component';
import { AdditionWarehouseViewComponent } from './addition-warehouse-view/addition-warehouse-view.component';
import { IssuesAdminComponent } from './issues-admin/issues-admin.component';
import { TransferItemsComponent } from './transfer-items/transfer-items.component';
import { IssueProductComponent } from './issue-product/issue-product.component';
import { PurchaseDetailComponent } from './purchase-detail/purchase-detail.component';
import { BorrowNotesDetailComponent } from './borrow-notes-detail/borrow-notes-detail.component';
import { StaffBorrowNotesDetailComponent } from './staff-borrow-notes-detail/staff-borrow-notes-detail.component';
import { AdditionProductComponent } from './addition-product/addition-product.component';
import { AdditionWarehouseGenericComponent } from './addition-warehouse-generic/addition-warehouse-generic.component';
import { AdditionGenericViewComponent } from './addition-generic-view/addition-generic-view.component';
import { AdditionProductViewComponent } from './addition-product-view/addition-product-view.component';
import { TransferItemsStaffComponent } from './transfer-items-staff/transfer-items-staff.component';
import { StaffProductStockRemainComponent } from './staff-product-stock-remain/staff-product-stock-remain.component';
import { StaffProductDetailStockRemainComponent } from './staff-product-detail-stock-remain/staff-product-detail-stock-remain.component';
import { AdjustStockDetailComponent } from './adjust-stock-detail/adjust-stock-detail.component';
import { AdjustStockProductComponent } from './adjust-stock-product/adjust-stock-product.component';
import { StaffProductReceiveOtherDetailComponent } from './staff-product-receive-other-detail/staff-product-receive-other-detail.component';
import { ReturnBudgetDetailComponent } from './return-budget-detail/return-budget-detail.component';
import { BorrowItemsComponent } from './borrow-items/borrow-items.component';
import { BorrowDetailComponent } from './borrow-detail/borrow-detail.component';
import { BorrowOtherDetailComponent } from './borrow-other-detail/borrow-other-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    HelperModule,
    FormsModule,
    DirectivesModule,
    ModalsModule
  ],
  declarations: [
    ProductDetailComponent,
    ProductCheckDetailComponent,
    RequisitionOrderItemsComponent,
    RequisitionOrderItemsPayComponent,
    RequisitionSuccessDetailComponent,
    DetailCycleWarehouseRemainComponent,
    TransferDetailComponent,
    TransferDetailStaffComponent,
    ProductInWarehouseDetailComponent,
    ProductInTemplateDetailComponent,
    InternalissueDetailComponent,
    ProductReceiveOtherDetailComponent,
    ProductStockRemainComponent,
    TransactionIssuedetailComponent,
    TransactionIssueDetailStaffComponent,
    ConfirmOrderItemsComponent,
    RequisitionOrderUnpaidItemsComponent,
    StaffRequisitionOrderItemsComponent,
    StaffRequisitionOrderUnpaidItemsComponent,
    StaffRequisitionOrderItemsPayComponent,
    IssuesComponent,
    AdditionWarehouseViewComponent,
    IssuesAdminComponent,
    TransferItemsComponent,
    IssueProductComponent,
    PurchaseDetailComponent,
    BorrowNotesDetailComponent,
    StaffBorrowNotesDetailComponent,
    AdditionProductComponent,
    AdditionWarehouseGenericComponent,
    AdditionGenericViewComponent,
    AdditionProductViewComponent,
    TransferItemsStaffComponent,
    StaffProductStockRemainComponent,
    StaffProductDetailStockRemainComponent,
    AdjustStockDetailComponent,
    AdjustStockProductComponent,
    StaffProductReceiveOtherDetailComponent,
    ReturnBudgetDetailComponent,
    BorrowItemsComponent,
    BorrowDetailComponent,
    BorrowOtherDetailComponent
  ],
  exports: [
    ProductDetailComponent,
    ProductCheckDetailComponent,
    RequisitionOrderItemsComponent,
    RequisitionOrderItemsPayComponent,
    RequisitionSuccessDetailComponent,
    DetailCycleWarehouseRemainComponent,
    TransferDetailComponent,
    TransferDetailStaffComponent,
    ProductInWarehouseDetailComponent,
    ProductInTemplateDetailComponent,
    InternalissueDetailComponent,
    ProductReceiveOtherDetailComponent,
    ProductStockRemainComponent,
    TransactionIssuedetailComponent,
    TransactionIssueDetailStaffComponent,
    ConfirmOrderItemsComponent,
    RequisitionOrderUnpaidItemsComponent,
    StaffRequisitionOrderItemsComponent,
    StaffRequisitionOrderUnpaidItemsComponent,
    StaffRequisitionOrderItemsPayComponent,
    IssuesComponent,
    AdditionWarehouseViewComponent,
    IssuesAdminComponent,
    TransferItemsComponent,
    IssueProductComponent,
    PurchaseDetailComponent,
    BorrowNotesDetailComponent,
    StaffBorrowNotesDetailComponent,
    AdditionProductComponent,
    AdditionWarehouseGenericComponent,
    AdditionGenericViewComponent,
    AdditionProductViewComponent,
    TransferItemsStaffComponent,
    StaffProductStockRemainComponent,
    StaffProductDetailStockRemainComponent,
    AdjustStockDetailComponent,
    AdjustStockProductComponent,
    StaffProductReceiveOtherDetailComponent,
    ReturnBudgetDetailComponent,
    BorrowItemsComponent,
    BorrowDetailComponent,
    BorrowOtherDetailComponent
  ]
})
export class GridDetailModule { }

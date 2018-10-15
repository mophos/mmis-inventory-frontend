import { PayRequisitionConfirmComponent } from './pay-requisition-confirm/pay-requisition-confirm.component';
import { PayRequisitionComponent } from './pay-requisition/pay-requisition.component';

import { ProductRequisitionComponent } from './product-requisition/product-requisition.component';
import { TransferNewComponent } from './transfer-new/transfer-new.component';
import { TransferComponent } from './transfer/transfer.component';
import { CountingComponent } from './counting/counting.component';
import { StaffGuard } from './../staff-guard';
import { MainComponent } from './main/main.component';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequisitionComponent } from './requisition/requisition.component';
import { RequisitionNewComponent } from './requisition-new/requisition-new.component';

//requisition template
import { RequisitionTemplateComponent } from './requisition-template/requisition-template.component';
import { RequisitionTemplateNewComponent } from './requisition-template-new/requisition-template-new.component';
import { RequisitionTemplateEditComponent } from './requisition-template-edit/requisition-template-edit.component';
import { HisMappingsComponent } from 'app/staff/his-mappings/his-mappings.component';
import { TransferEditComponent } from 'app/staff/transfer-edit/transfer-edit.component';
import { IssueTransactionComponent } from 'app/staff/issue-transaction/issue-transaction.component';
import { IssueTransactionNewComponent } from 'app/staff/issue-transaction-new/issue-transaction-new.component';
import { IssueTransactionEditComponent } from 'app/staff/issue-transaction-edit/issue-transaction-edit.component';
import { PlanningComponent } from 'app/staff/planning/planning.component';
import { HisIssueTransactionComponent } from 'app/staff/his-issue-transaction/his-issue-transaction.component';
import { AuthHISMapping } from 'app/auth-his-mapping.service';
import { AuthHISTransaction } from 'app/auth-his-transaction.service';
import { AuthMinMaxPlanning } from 'app/auth-minmax-planing.service';
import { AuthAdjustService } from 'app/auth-adjust.service';
import { AuthBorrowService } from 'app/auth-borrow.service';
import { ProductsComponent } from 'app/staff/products/products.component';
import { BorrowNoteComponent } from './borrow-note/borrow-note.component';
import { BorrowNoteNewComponent } from './borrow-note-new/borrow-note-new.component';
import { AdjustStockComponent } from './adjust-stock/adjust-stock.component';
import { AdjustStockNewComponent } from './adjust-stock-new/adjust-stock-new.component';
import { StockCardComponent } from 'app/staff/report/stock-card/stock-card.component';
import { ReceivesComponent } from 'app/staff/receives/receives.component'
import { ReceivesOtherComponent } from 'app/staff/receives-other/receives-other.component';
import { ReceivesOtherEditComponent } from 'app/staff/receives-other-edit/receives-other-edit.component';
import { ExportdataComponent } from './exportdata/exportdata.component';
import { ValueReceiveOtherComponent } from '../staff/report/value-receive-other/value-receive-other.component';
import { BorrowComponent } from './borrow/borrow.component';
import { BorrowNewComponent } from './borrow-new/borrow-new.component';
import { BorrowEditComponent } from './borrow-edit/borrow-edit.component';
import { BorrowotherNewComponent } from './borrowother-new/borrowother-new.component';
import { BorrowotherEditComponent } from './borrowother-edit/borrowother-edit.component';
import { ReturnedComponent } from './returned/returned.component';
import { ReturnedEditComponent } from './returned-edit/returned-edit.component';

const routes: Routes = [
  {
    path: 'staff',
    component: LayoutComponent,
    canActivate: [StaffGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'receives', component: ReceivesComponent },
      { path: 'receives/other', component: ReceivesOtherComponent },
      { path: 'receives/other/edit', component: ReceivesOtherEditComponent },
      { path: 'planning', canActivate: [AuthMinMaxPlanning], component: PlanningComponent },
      { path: 'counting', component: CountingComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'transfer/new', component: TransferNewComponent },
      { path: 'transfer/edit', component: TransferEditComponent },
      { path: 'return-product/new', component: ReturnedComponent },
      { path: 'return-product/edit', component: ReturnedEditComponent },
      {
        path: 'requisition',
        canActivate: [StaffGuard],
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },
          { path: 'main', component: RequisitionComponent },
          { path: 'new', component: RequisitionNewComponent },
          { path: 'edit/:requisitionId', component: RequisitionNewComponent },
          { path: 'templates', component: RequisitionTemplateComponent },
          { path: 'templates/new', component: RequisitionTemplateNewComponent },
          { path: 'templates/edit/:templateId', component: RequisitionTemplateEditComponent }
        ]
      },
      {
        path: 'borrow',
        canActivate: [StaffGuard],
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
        path: 'pay-requisition',
        canActivate: [StaffGuard],
        children: [
          { path: '', redirectTo: 'main', pathMatch: 'full' },
          { path: 'main', component: PayRequisitionComponent },
          { path: 'confirm', component: PayRequisitionConfirmComponent }
          // { path: 'new', component: RequisitionNewComponent },
          // { path: 'edit/:requisitionId', component: RequisitionNewComponent },
          // { path: 'templates', component: RequisitionTemplateComponent },
          // { path: 'templates/new', component: RequisitionTemplateNewComponent },
          // { path: 'templates/edit/:templateId', component: RequisitionTemplateEditComponent }
        ]
      },
      { path: 'his-mappings', canActivate: [AuthHISMapping], component: HisMappingsComponent },
      { path: 'issue-transaction', component: IssueTransactionComponent },
      { path: 'issue-transaction/new', component: IssueTransactionNewComponent },
      { path: 'issue-transaction/edit', component: IssueTransactionEditComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'his-issue-transaction', canActivate: [AuthHISTransaction], component: HisIssueTransactionComponent },
      { path: 'borrow-notes', canActivate: [AuthBorrowService], component: BorrowNoteComponent },
      { path: 'borrow-notes/new', canActivate: [AuthBorrowService], component: BorrowNoteNewComponent },
      { path: 'borrow-notes/:borrowNoteId/edit', canActivate: [AuthBorrowService], component: BorrowNoteNewComponent },
      { path: 'product/requisition', component: ProductRequisitionComponent },
      { path: 'adjust-stock', canActivate: [AuthAdjustService], component: AdjustStockComponent },
      { path: 'adjust-stock/new', canActivate: [AuthAdjustService], component: AdjustStockNewComponent },
      { path: 'reports/stock-card', component: StockCardComponent },
      { path: 'exportdata', component: ExportdataComponent },
      { path: 'reports/value-receive-other', component: ValueReceiveOtherComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }

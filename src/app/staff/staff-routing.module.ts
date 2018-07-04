
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
import { ProductsComponent } from 'app/staff/products/products.component';
import { BorrowNoteComponent } from './borrow-note/borrow-note.component';
import { BorrowNoteNewComponent } from './borrow-note-new/borrow-note-new.component';
import { AdjustStockComponent } from './adjust-stock/adjust-stock.component';
import { AdjustStockNewComponent } from './adjust-stock-new/adjust-stock-new.component';
import { StockCardComponent } from 'app/staff/report/stock-card/stock-card.component'

const routes: Routes = [
  {
    path: 'staff',
    component: LayoutComponent,
    canActivate: [StaffGuard],
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: MainComponent },
      { path: 'planning', canActivate: [AuthMinMaxPlanning], component: PlanningComponent },
      { path: 'requisition', component: RequisitionComponent },
      { path: 'requisition/new', component: RequisitionNewComponent },
      { path: 'requisition/edit/:requisitionId', component: RequisitionNewComponent },
      { path: 'counting', component: CountingComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'transfer/new', component: TransferNewComponent },
      { path: 'transfer/edit', component: TransferEditComponent },
      { path: 'requisition-templates', component: RequisitionTemplateComponent },
      { path: 'requisition-templates/new', component: RequisitionTemplateNewComponent },
      { path: 'requisition-templates/edit/:templateId', component: RequisitionTemplateEditComponent },
      { path: 'his-mappings', canActivate: [AuthHISMapping], component: HisMappingsComponent },
      { path: 'issue-transaction', component: IssueTransactionComponent },
      { path: 'issue-transaction/new', component: IssueTransactionNewComponent },
      { path: 'issue-transaction/edit', component: IssueTransactionEditComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'his-issue-transaction', canActivate: [AuthHISTransaction], component: HisIssueTransactionComponent },
      { path: 'borrow-notes', canActivate: [AuthHISTransaction], component: BorrowNoteComponent },
      { path: 'borrow-notes/new', canActivate: [AuthHISTransaction], component: BorrowNoteNewComponent },
      { path: 'borrow-notes/:borrowNoteId/edit', canActivate: [AuthHISTransaction], component: BorrowNoteNewComponent },
      { path: 'product/requisition', component: ProductRequisitionComponent },
      { path: 'adjust-stock', canActivate: [AuthAdjustService], component: AdjustStockComponent },
      { path: 'adjust-stock/new', canActivate: [AuthAdjustService], component: AdjustStockNewComponent },
      { path: 'reports/stock-card', component: StockCardComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }

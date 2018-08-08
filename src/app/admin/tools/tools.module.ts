import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { HelperModule } from '../../helper/helper.module';
import { StockcardComponent } from './stockcard/stockcard.component';
import { ModalsModule } from '../../modals/modals.module';
import { DirectivesModule } from '../../directives/directives.module';
import { StockcardReceiveComponent } from './stockcard-receive/stockcard-receive.component';
import { StockcardReceiveOtherComponent } from './stockcard-receive-other/stockcard-receive-other.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { HttpModule } from '../../../../node_modules/@angular/http';
import { GridDetailModule } from 'app/grid-detail/grid-detail.module';
import { StockcardRequisitionComponent } from './stockcard-requisition/stockcard-requisition.component';
import { StockcardTransferComponent } from './stockcard-transfer/stockcard-transfer.component';
import { StockcardIssueComponent } from './stockcard-issue/stockcard-issue.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    HttpModule,
    HelperModule,
    DirectivesModule,
    MyDatePickerTHModule,
    ModalsModule,
    TextMaskModule,
    GridDetailModule
  ],
  declarations: [StockcardComponent, StockcardReceiveComponent, StockcardReceiveOtherComponent, StockcardRequisitionComponent, StockcardTransferComponent, StockcardIssueComponent]
})
export class ToolsModule { }

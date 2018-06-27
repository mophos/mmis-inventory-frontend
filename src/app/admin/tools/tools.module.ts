import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { MyDatePickerTH, MyDatePickerTHModule } from 'mydatepicker-th';
import { HelperModule } from '../../helper/helper.module';
import { StockcardComponent } from './stockcard/stockcard.component';
import { ModalsModule } from '../../modals/modals.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    MyDatePickerTHModule,
    HelperModule,
    ModalsModule,
    DirectivesModule
  ],
  declarations: [StockcardComponent]
})
export class ToolsModule { }

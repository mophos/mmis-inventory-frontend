import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { MyDatePickerTH, MyDatePickerTHModule } from 'mydatepicker-th';
import { HelperModule } from '../../helper/helper.module';
import { StockcardComponent } from './stockcard/stockcard.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    MyDatePickerTHModule,
    HelperModule
  ],
  declarations: [StockcardComponent]
})
export class ToolsModule { }

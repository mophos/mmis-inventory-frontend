import { AlertService } from 'app/alert.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'wm-adjust-stock-detail',
  templateUrl: './adjust-stock-detail.component.html',
  styles: []
})
export class AdjustStockDetailComponent implements OnInit {

  details: any = [];
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input('data')
  set setData(value: any) {
    this.details = value;
  }

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    console.log(this.details);
  }

}

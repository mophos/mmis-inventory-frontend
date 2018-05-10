import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-warehouse-generic',
  templateUrl: './addition-warehouse-generic.component.html',
  styles: []
})
export class AdditionWarehouseGenericComponent implements OnInit {

  @Input('transactionId') transactionId;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  totalTransferQty = 0;
  loading = false;
  transactions: any = [];
  dstWarehouseName: any;

  constructor(
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getTransactionInfo();
  }

  async getTransactionInfo() {
    try {
      this.loading = true;
      const rs: any = await this.additionService.getTransactionInfo(this.transactionId);
      if (rs.ok) {
        this.transactions = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

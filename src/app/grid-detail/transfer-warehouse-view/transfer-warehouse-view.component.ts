import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-warehouse-view',
  templateUrl: './transfer-warehouse-view.component.html',
  styles: []
})
export class TransferWarehouseViewComponent implements OnInit {
  @Input('transactionId') transactionId;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  totalTransferQty = 0;
  loading = false;
  transactions: any = [];
  dstWarehouseName: any;

  constructor(
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getTransactionInfo();
  }

  async getTransactionInfo() {
    try {
      this.loading = true;
      const rs: any = await this.dashboardService.getTransactionInfo(this.transactionId);
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

import { async } from '@angular/core/testing';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-warehouse-new',
  templateUrl: './transfer-warehouse-new.component.html',
  styles: []
})
export class TransferWarehouseNewComponent implements OnInit {

  @ViewChild('modalLoading') private modalLoading;
  @Input('dstWarehouseId') dstWarehouseId;
  @Output('refresh') refresh = new EventEmitter();
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  srcWarehouseId: any;
  status: any;
  transactionDate: any;
  totalTransferQty = 0;
  loading = false;
  generics: any = [];
  perPage: 10;

  constructor(
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.srcWarehouseId = +decodedToken.warehouseId;
  }

  ngOnInit() {
    this.status = 'OPEN';
    this.transactionDate = moment().format('YYYY-MM-DD');
    this.getWarehouseGeneric();
  }

  async getWarehouseGeneric() {
    try {
      this.loading = true;
      const rs: any = await this.dashboardService.getDashboardWarehouse(this.dstWarehouseId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  filterGenericsIsSuccess(isSuccess) {
    return this.generics.filter(g => g.is_success === isSuccess);
  }

  validate(genericId) {
    const idx = _.findIndex(this.generics, ['generic_id', genericId]);
    this.generics[idx].is_success = 'Y';
  }

  changeQty(genericId, event) {
    const idx = _.findIndex(this.generics, ['generic_id', genericId]);
    this.generics[idx].detail = event;
    this.generics[idx].total_transfer_qty = _.sumBy(event, function (e: any) {
      return e.transfer_qty * e.conversion_qty;
    });
  }

  save() {
    // if (this.filterGenericsIsSuccess('N').length) {
    //   this.alertService.confirm('มีรายการที่ไม่สมบูรณ์ ต้องการบันทึกข้อมูลใช่หรือไม่?')
    //     .then(() => {
    //       this.saveTransaction();
    //     })
    //     .catch(() => { });
    // } else {
      this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
        .then(() => {
          this.saveTransaction();
        })
        .catch(() => { });
    // }
  }

  async saveTransaction() {
    this.modalLoading.show();
    const _header = {
      srcWarehouseId: this.srcWarehouseId,
      dstWarehouseId: this.dstWarehouseId,
      status: this.status,
      transactionDate: this.transactionDate
    };
    try {
      const rs: any = await this.dashboardService.saveTransaction(_header, this.generics);
      if (rs.ok) {
        this.alertService.success();
        // this.router.navigate(['/admin/transfer-dashboard']);
        this.refresh.emit();
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

}

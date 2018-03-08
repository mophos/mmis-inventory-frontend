import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-dashboard-warehouse',
  templateUrl: './transfer-dashboard-warehouse.component.html',
  styles: []
})
export class TransferDashboardWarehouseComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  transactionId: any;
  srcWarehouseId: any;
  dstWarehouseId: any;
  dstWarehouseCode: any;
  dstMinQty: any;
  dstRemainQty: any;
  dstMaxQty: any;
  status: any;
  transactionDate: any;
  srcRemainQty: any;
  srcMinQty = 0;
  dstWarehouseName: any;
  generics: any = [];
  unitName: any;
  perPage = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) {

    this.route.queryParams.subscribe(params => {
      this.dstWarehouseId = params.warehouseId;
    });

    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.srcWarehouseId = +decodedToken.warehouseId;
  }

  async ngOnInit() {
    this.status = 'OPEN';
    this.transactionDate = moment().format('YYYY-MM-DD');
    this.getDashboardWarehouse();
  }

  async getDashboardWarehouse() {
    try {
      this.modalLoading.show();
      const rs: any = await this.dashboardService.getDashboardWarehouse(this.dstWarehouseId);
      if (rs.ok) {
        this.dstWarehouseName = rs.rows[0].dst_warehouse_name;
        this.dstWarehouseCode = rs.rows[0].dst_warehouse_code;
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
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
    const totalTransferQty = _.sumBy(this.generics, function (e: any) {
      return e.total_transfer_qty;
    });
    if (totalTransferQty) {
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
          this.router.navigate(['/admin/transfer-dashboard']);
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
    } else {
      this.alertService.error('ไม่พบรายการที่มีการเติม');
    }
  }

  filterGenericsIsSuccess(isSuccess) {
    return this.generics.filter(g => g.is_success === isSuccess);
  }

  valid(genericId) {
    const idx = _.findIndex(this.generics, ['generic_id', genericId]);
    this.generics[idx].is_success = 'Y';
  }

}

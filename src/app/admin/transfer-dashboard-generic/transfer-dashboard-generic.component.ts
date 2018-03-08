import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-dashboard-generic',
  templateUrl: './transfer-dashboard-generic.component.html',
  styles: []
})
export class TransferDashboardGenericComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;

  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  srcWarehouseId: any;
  dstWarehouseId: any;
  dstMinQty: any;
  dstRemainQty: any;
  dstMaxQty: any;
  status: any;
  transactionDate: any;
  transferQty: any;
  srcRemainQty: any;
  srcMinQty = 0;
  genericId: any;
  genericName: any;
  generics: any = [];
  unitName: any;
  workingCode: any;
  perPage = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.genericId = params.genericId;
      });

    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.srcWarehouseId = +decodedToken.warehouseId;
  }

  async ngOnInit() {
    this.status = 'OPEN';
    this.transactionDate = moment().format('YYYY-MM-DD');
    this.getGenericDetail();
    this.getDashboardGeneric();
  }

  async getGenericDetail() {
    try {
      this.modalLoading.show();
      const rs: any = await this.dashboardService.getGenericDetail(this.genericId);
      if (rs.ok && rs.detail) {
        this.genericName = rs.detail.generic_name;
        this.workingCode = rs.detail.working_code;
        this.srcRemainQty = +rs.detail.src_remain_qty;
        this.srcMinQty = +rs.detail.src_min_qty;
        this.unitName = rs.detail.unit_name;
      } else {
        this.alertService.error("ไม่พบรายการเวชภัณฑ์นี้ในคลัง");
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getDashboardGeneric() {
    try {
      this.modalLoading.show();
      const rs: any = await this.dashboardService.getDashboardGeneric(this.genericId);
      if (rs.ok) {
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

  changeQty(idx, event) {
    this.generics[idx].detail = event;
  }

  changeUnit(idx, event) {
    this.generics[idx].detail = event;
  }

  save() {
    this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        const _header = {
          srcWarehouseId: this.srcWarehouseId,
          srcMinQty: this.srcMinQty,
          srcRemainQty: this.srcRemainQty,
          transferQty: this.transferQty,
          status: this.status,
          transactionDate: this.transactionDate
        }
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
      })
      .catch(() => {

      });
  }

}

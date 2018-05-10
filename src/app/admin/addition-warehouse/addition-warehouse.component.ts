import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-warehouse',
  templateUrl: './addition-warehouse.component.html',
  styles: []
})
export class AdditionWarehouseComponent implements OnInit {

  @ViewChild('modalLoading') private modalLoading;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  transactionId: any;
  dstWarehouseId: any;
  dstWarehouseCode: any;
  dstMinQty: any;
  dstRemainQty: any;
  dstMaxQty: any;
  dstWarehouseName: any;
  generics: any = [];
  perPage = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) {

    this.route.queryParams.subscribe(params => {
      this.dstWarehouseId = params.warehouseId;
    });

    this.token = sessionStorage.getItem('token');
  }

  async ngOnInit() {
    this.getDashboardWarehouse();
  }

  async getDashboardWarehouse() {
    try {
      this.modalLoading.show();
      const rs: any = await this.additionService.getDashboardWarehouse(this.dstWarehouseId);
      if (rs.ok) {
        this.dstWarehouseName = rs.rows[0].dst_warehouse_name;
        this.dstWarehouseCode = rs.rows[0].dst_short_code;
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
    this.generics[idx].addition_qty = _.sumBy(event, function (e: any) {
      return e.transfer_qty * e.conversion_qty;
    });
  }

  save() {
      this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
        .then(() => {
          this.saveTransaction();
        })
        .catch(() => { });
  }

  async saveTransaction() {
    const totalAdditionQty = _.sumBy(this.generics, function (e: any) {
      return e.addition_qty;
    });
    if (totalAdditionQty) {
      this.modalLoading.show();
      try {
        const rs: any = await this.additionService.saveAdditionWarehouse(this.dstWarehouseId, this.generics);
        if (rs.ok) {
          this.alertService.success();
          this.router.navigate(['/admin/addition']);
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

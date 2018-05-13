import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-generic',
  templateUrl: './addition-generic.component.html',
  styles: []
})
export class AdditionGenericComponent implements OnInit {

  @ViewChild('modalLoading') private modalLoading;
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  genericId: any
  workingCode: any;
  genericName: any;
  srcRemainQty: any;
  srcAdditionQty: any;
  srcUnitName: any;
  warehouses: any = [];
  perPage = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) {

    this.route.queryParams.subscribe(params => {
      this.genericId = params.genericId;
    });

    this.token = sessionStorage.getItem('token');
  }

  async ngOnInit() {
    this.getDashboardGeneric();
  }

  async getDashboardGeneric() {
    try {
      this.modalLoading.show();
      const rs: any = await this.additionService.getDashboardGeneric(this.genericId);
      if (rs.ok) {
        this.workingCode = rs.rows[0].working_code;
        this.genericName = rs.rows[0].generic_name;
        this.srcRemainQty = rs.rows[0].src_remain_qty || 0;
        this.srcAdditionQty = _.sumBy(rs.rows, 'addition_qty');
        this.srcUnitName = rs.rows[0].unit_name;
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  changeQty(warehouse_id, event) {
    const idx = _.findIndex(this.warehouses, ['dst_warehouse_id', warehouse_id]);
    this.warehouses[idx].detail = event;
    this.warehouses[idx].addition_qty = _.sumBy(event, function (e: any) {
      return e.addition_qty * e.conversion_qty;
    });
    this.srcAdditionQty = _.sumBy(this.warehouses, 'addition_qty');
  }

  save() {
      this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
        .then(() => {
          this.saveTransaction();
        })
        .catch(() => { });
  }

  async saveTransaction() {
    const totalAdditionQty = _.sumBy(this.warehouses, function (e: any) {
      return e.addition_qty;
    });
    if (totalAdditionQty) {
      this.modalLoading.show();
      try {
        const rs: any = await this.additionService.saveAdditionGeneric(this.warehouses);
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

}

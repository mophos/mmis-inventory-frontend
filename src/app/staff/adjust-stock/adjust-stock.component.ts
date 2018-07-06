import { StaffService } from './../staff.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';
import { State } from "@clr/angular";
@Component({
  selector: 'wm-adjust-stock',
  templateUrl: './adjust-stock.component.html',
  styles: []
})
export class AdjustStockComponent implements OnInit {


  @ViewChild('modalLoading') public modalLoading: any;

  jwtHelper: JwtHelper = new JwtHelper();
  decodedToken: any;
  warehouseId: any;
  lists: any;
  totalList: any;
  perPage = 5;
  currentPage = 1;
  constructor(
    private staffService: StaffService,
    private alertService: AlertService,
  ) {
    const token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  ngOnInit() {
    this.warehouseId = this.decodedToken.warehouseId;
    this.getLists();
  }

  async getLists() {
    this.modalLoading.show();
    try {
      const rs: any = await this.staffService.getListStockAdjust(this.perPage, 0);
      if (rs) {
        this.lists = rs.rows;
        this.totalList = rs.total;
        this.modalLoading.hide();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(error.error));
    }
  }

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.modalLoading.show();
    try {
      const rs: any = await this.staffService.getListStockAdjust(limit, offset);
      if (rs) {
        this.lists = rs.rows;
        this.totalList = rs.total;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
}

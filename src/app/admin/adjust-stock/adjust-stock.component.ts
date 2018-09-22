import { AdjustStockService } from './../adjust-stock.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';
import { State } from "@clr/angular";
import * as _ from 'lodash';
@Component({
  selector: 'wm-adjust-stock',
  templateUrl: './adjust-stock.component.html'
})
export class AdjustStockComponent implements OnInit {


  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;

  jwtHelper: JwtHelper = new JwtHelper();
  decodedToken: any;
  warehouseId: any;
  lists: any;
  totalList: any;
  perPage = 15;
  currentPage = 1;
  selectAdjust = []
  token: string;
  constructor(
    private adjustStockService: AdjustStockService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.warehouseId = this.decodedToken.warehouseId;
    this.getLists();
  }

  async getLists() {
    this.modalLoading.show();
    try {
      const rs: any = await this.adjustStockService.getList(this.perPage, 0);
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
      const rs: any = await this.adjustStockService.getList(limit, offset);
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
  report(){
    let adjustId = _.map(this.selectAdjust,(o:any)=>{
      return o.adjust_id
    }).join('&adjustId=')
    const url = `${this.apiUrl}/report/adjust-stockcard?token=${this.token}&adjustId=${adjustId}`;
    this.htmlPreview.showReport(url, 'landscape');
  }
}

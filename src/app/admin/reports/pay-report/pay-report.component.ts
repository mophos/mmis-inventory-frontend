import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import { RequisitionTypeService } from '../../requisition-type.service';
import { TransectionTypeService } from '../../transection-type.service';
import { State } from "@clr/angular";

@Component({
  selector: 'wm-pay-report',
  templateUrl: './pay-report.component.html',
  styleUrls: ['./pay-report.component.css']
})
export class PayReportComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  // @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  startDate: any;
  endDate: any;
  warehouses: any = [];
  warehouseId: any = 0;
  warehouseName: any;
  isPreview = false;
  selectedGenericId = 0;
  token: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  options: any;
  reqTypes: any;
  issueTypes: any;
  issueTypesSelect: any = [];
  reqTypesSelect: any = [];
  tab = 'req';
  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private requisitionTypeService: RequisitionTypeService,
    private transectionTypeService: TransectionTypeService,
    private alertService: AlertService) {
    this.token = sessionStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId
    this.warehouseName = decodedToken.warehouseName
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }
  tabIssue(){
    this.tab = 'issue'
    this.issueTypesSelect = []
    this.reqTypesSelect = []
  }
  tabReq(){
    this.tab = 'req'
    this.issueTypesSelect = []
    this.reqTypesSelect = []
  }
  ngOnInit() {
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.getWarehouseList();

  }

  showReportReq() {
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    let reqTypeId: any
    reqTypeId = _.map(this.reqTypesSelect, (b: any) => {
      return b.requisition_type_id;
    }).join('&reqTypeId=')
    console.log(reqTypeId);
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/pay-req/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}&reqTypeId=${reqTypeId}`;
    this.htmlPreview.showReport(url, 'landscape');
  }
  showReportIssue() {
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    let transectionId: any
    transectionId = _.map(this.issueTypesSelect, (b: any) => {
      return b.transaction_id;
    }).join('&transectionId=')
    console.log(transectionId);
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/pay-issue/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}&transectionId=${transectionId}`;
    this.htmlPreview.showReport(url, 'landscape');
  }
  getWarehouseList() {
    this.warehouseService.all()
      .then((result: any) => {
        if (result.ok) {
          this.warehouses = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      });
  }
  refreshReq(state: State) {
    this.getReqTypes();
  }
  refreshIssue(state: State) {
    this.getIssueTypes();
  }
  async getReqTypes() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.requisitionTypeService.all()
      if (rs.ok) {
        this.reqTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      // this.modalLoading.hide();
    } catch (error) {
      // this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getIssueTypes() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.transectionTypeService.all()
      if (rs.ok) {
        this.issueTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      // this.modalLoading.hide();
    } catch (error) {
      // this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  refresh() {
    this.warehouseId = 0;
    this.reqTypesSelect = []
    this.issueTypesSelect = []
  }
  // exportExcel() {
  //   if (+this.warehouseId !== 0) {
  //     this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
  //     this.warehouseName = this.warehouseName.warehouse_name
  //   } else {
  //     this.warehouseName = 'ทุกคลังสินค้า'
  //   }
  //   let receiveTpyeId: any
  //   receiveTpyeId = _.map(this.receiveTypesSelect, (b: any) => {
  //     return b.receive_type_id;
  //   }).join('&receiveTpyeId=')
  //   console.log(receiveTpyeId);
  //   const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
  //   const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
  //   const url = `${this.apiUrl}/report/receiveOrthorCost/excel/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}&receiveTpyeId=${receiveTpyeId}`;
  //   window.open(url, '_blank');
  // }
}

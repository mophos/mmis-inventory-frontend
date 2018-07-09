import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { SearchGenericAutocompleteComponent } from '../../../directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as _ from 'lodash';
import { ReceiveService } from '../../receive.service';
@Component({
  selector: 'wm-value-receive-other',
  templateUrl: './value-receive-other.component.html',
  styleUrls: ['./value-receive-other.component.css']
})
export class ValueReceiveOtherComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
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
  receiveTypesSelect:any =[];
  options: any;
  receiveTypes: any;
  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private receiveService: ReceiveService,
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
    console.log(this.receiveTypesSelect.length);
    
  }

  showReport() {
    console.log(+this.warehouseId);
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    let receiveTpyeId: any 
    receiveTpyeId = _.map(this.receiveTypesSelect,(b:any)=>{
      return b.receive_type_id;
    }).join('&receiveTpyeId=')
    console.log(receiveTpyeId);
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/receiveOrthorCost/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}&receiveTpyeId=${receiveTpyeId}`;
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
  refreshWaiting(){
    this.getReceiveTypes();
  }
  async getReceiveTypes() {
    try {
      // this.modalLoading.show();
      const rs: any = await this.receiveService.getReceiveTypes()
      if (rs.ok) {
        this.receiveTypes = rs.rows;
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
    this.receiveTypesSelect = []
  }
}

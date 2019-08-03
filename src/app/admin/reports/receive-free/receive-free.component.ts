import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { SearchGenericAutocompleteComponent } from '../../../directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as _ from 'lodash';
import { ReceiveService } from '../../receive.service';
import { State } from "@clr/angular";
@Component({
  selector: 'wm-receive-free',
  templateUrl: './receive-free.component.html',
  styleUrls: ['./receive-free.component.css']
})
export class ReceiveFreeComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;

  receiveDate: any;
  warehouses: any = [];
  warehouseId: any = 0;
  warehouseName: any;
  isPreview = false;
  selectedGenericId = 0;
  token: any;
  note: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  receiveTypesSelect: any = [];
  options: any;
  receiveTypes: any;

  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private receiveService: ReceiveService,
    private alertService: AlertService) {
    this.token = sessionStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }

  async ngOnInit() {

    this.warehouseName = localStorage.getItem('rec-f-12-w');
    this.note = localStorage.getItem('rec-f-12-n');
    const date = new Date();

    this.receiveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    await this.getReceiveTypes();
    await this.getWarehouseList();
  }

  showReport() {

    localStorage.setItem('rec-f-12-w', this.warehouseName)
    localStorage.setItem('rec-f-12-n', this.note)
    let receiveTypeId: any
    receiveTypeId = _.map(this.receiveTypesSelect, (b: any) => {
      return b.receive_type_id;
    }).join('&receiveTypeId=')
    const receiveDate = this.receiveDate ? moment(this.receiveDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/reports/receive/free?warehouseId=${this.warehouseId}&receiveDate=${receiveDate}&token=${this.token}&receiveTypeId=${receiveTypeId}&note=${this.note}&warehouseName=${this.warehouseName}`;
    this.htmlPreview.showReport(url);
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


  async getReceiveTypes() {
    try {
      const rs: any = await this.receiveService.getReceiveTypes()
      if (rs.ok) {
        this.receiveTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }


}

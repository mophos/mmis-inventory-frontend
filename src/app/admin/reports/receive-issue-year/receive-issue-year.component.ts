import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ReportProductsService } from './../reports-products.service'
import { AlertService } from '../../../alert.service';
import { JwtHelper } from '../../../../../node_modules/angular2-jwt';
import * as  moment from 'moment'
import { ProductsService } from '../../products.service';
import { State } from "@clr/angular";

@Component({
  selector: 'wm-receive-issue-year',
  templateUrl: './receive-issue-year.component.html',
  styleUrls: ['./receive-issue-year.component.css']
})
export class ReceiveIssueYearComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  jwtHelper: JwtHelper = new JwtHelper();
  year: any;
  yearSelect: any = moment().get('year') + 543;
  token: string;
  isPreview = false;
  genericTypes = [];
  genericTypeSelect: any = [];
  constructor(
    private reportProductService: ReportProductsService,
    private productService: ProductsService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
  }
  ngOnInit() {
    this.getButgetYear();
    this.getGenericsType();
  }
  showReport() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    const url = `${this.apiUrl}/report/receiveIssueYear/${this.yearSelect}?token=${this.token}&` + genericType.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }
  async exportExcel() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/report/receive-issue/year/export/${this.yearSelect}?token=${token}&` + genericType.join('&');;
    window.open(url, '_blank');
  }
  async getButgetYear() {
    const rs: any = await this.reportProductService.getButgetYear();
    if (rs.ok) {
      this.year = rs.row;
      this.yearSelect = rs.row[0].bg_year;
    } else {
      this.alertService.error(rs.error);
    }
  }

  async getGenericsType() {
    try {
      const rs = await this.productService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  refreshWaiting(state: State) {
    this.getGenericsType();
  }
}

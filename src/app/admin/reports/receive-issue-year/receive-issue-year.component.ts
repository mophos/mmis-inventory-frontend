import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ReportProductsService } from './../reports-products.service'
import { AlertService } from '../../../alert.service';
import { JwtHelper } from '../../../../../node_modules/angular2-jwt';
import * as  moment from 'moment'

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
  constructor(
    private reportProductService: ReportProductsService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.getButgetYear();
    console.log(this.yearSelect);

  }

  showReport() {
    const url = `${this.apiUrl}/report/receiveIssueYear/${this.year}?token=${this.token}`;
    this.htmlPreview.showReport(url, 'landscape');
  }


  async getButgetYear() {
    const rs: any = await this.reportProductService.getButgetYear();
    if (rs.ok) {
      this.year = rs.row;
    } else {
      this.alertService.error(rs.error);
    }
  }

  exportExcel() {

  }
}

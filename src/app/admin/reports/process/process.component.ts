import { AlertService } from 'app/alert.service';
import { ReportsService } from './../../reports.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'wm-process',
  templateUrl: './process.component.html',
  styles: []
})
export class ProcessComponent implements OnInit {

  token: any;
  list = []
  @ViewChild('htmlPreview') public htmlPreview: any;
  constructor(
    private reportsService: ReportsService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
  }

  async ngOnInit() {
    await this.getList();
    setInterval(() => this.getList(), 5000);
  }

  async getList() {
    try {
      const rs: any = await this.reportsService.getReportProcess();
      if (rs.ok) {
        this.list = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  print(i) {
    const url = `${this.apiUrl}/reports/process/${i.id}?token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-exportdata',
  templateUrl: './exportdata.component.html',
  styleUrls: []
})
export class ExportdataComponent implements OnInit {


  constructor(
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
  }

  exportRemain() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/report/remain/qty/export?token=${token}`;
    window.open(url, '_blank');
  }

  exportRemainTrade() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/report/remain-trade/qty/export?token=${token}`;
    window.open(url, '_blank');
  }

  exportDistribute() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/reports/export/distribute?token=${token}`;
    window.open(url, '_blank');
  }

  exportDruglist() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/reports/export/druglist?token=${token}`;
    window.open(url, '_blank');
  }

  exportInventory() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/reports/export/inventory?token=${token}`;
    window.open(url, '_blank');
  }

  exportReceive() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/reports/export/receive?token=${token}`;
    window.open(url, '_blank');
  }
}

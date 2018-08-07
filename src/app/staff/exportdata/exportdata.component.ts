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

  async exportRemain() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/report/remain/qty/export?token=${token}`;
    window.open(url, '_blank');
  }

  async exportRemainTrade() {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/report/remain-trade/qty/export?token=${token}`;
    window.open(url, '_blank');
  }
}

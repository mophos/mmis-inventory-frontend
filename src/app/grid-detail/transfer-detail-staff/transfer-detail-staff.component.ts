import { AlertService } from './../../alert.service';
import { TransferService } from './../../staff/transfer.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-transfer-detail-staff',
  templateUrl: './transfer-detail-staff.component.html',
  styleUrls: ['./transfer-detail-staff.component.css']
})
export class TransferDetailStaffComponent implements OnInit {
  loading = false;
  items: any = [];
  @Input('transferId') transferId: any;

  constructor(
    private transferService: TransferService,
    private alertService: AlertService
  ) { }
  ngOnInit() {
    this.showDetail();
  }

  showDetail() {
    this.items = [];
    this.loading = true;
    this.transferService.detail(this.transferId)
      .then((result: any) => {
        if (result.ok) {
          this.items = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error(error.message);
      });
  }
}

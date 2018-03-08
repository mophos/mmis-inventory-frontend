import { AlertService } from './../../alert.service';
import { TransferService } from './../../admin/transfer.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-transfer-detail',
  templateUrl: './transfer-detail.component.html',
  styleUrls: ['./transfer-detail.component.css']
})
export class TransferDetailComponent implements OnInit {

  @Input('transferId') transferId: any;

  loading = false;
  items: any = [];

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

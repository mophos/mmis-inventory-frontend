import { AlertService } from './../../alert.service';
import { BorrowItemsService } from './../../admin/borrow-items.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-borrow-detail',
  templateUrl: './borrow-detail.component.html',
  styleUrls: [ ]
})
export class BorrowDetailComponent implements OnInit {

  @Input('borrowId') borrowId: any;

  loading = false;
  items: any = [];

  constructor(
    private borrowItemsService: BorrowItemsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.showDetail();
  }

  showDetail() {
    this.items = [];
    this.loading = true;
    this.borrowItemsService.detail(this.borrowId)
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
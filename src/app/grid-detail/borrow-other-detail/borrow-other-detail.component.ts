import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';
import { BorrowOtherService } from './../../admin/borrow-other.service';

@Component({
  selector: 'wm-borrow-other-detail',
  templateUrl: './borrow-other-detail.component.html',
  styleUrls: ['./borrow-other-detail.component.css']
})
export class BorrowOtherDetailComponent implements OnInit {
  @Input() borrowId: any;
  loading = false;
  products = [];

  constructor(
    private borrowOtherService: BorrowOtherService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductList();
  }

  async getProductList() {
    this.loading = true;
    try {
      const rs = await this.borrowOtherService.getGenericList(this.borrowId)
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}

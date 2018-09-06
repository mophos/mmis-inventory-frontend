import { AlertService } from './../../alert.service';
import { BorrowItemsService } from './../../admin/borrow-items.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-returned-detail',
  templateUrl: './returned-detail.component.html',
  styleUrls: ['./returned-detail.component.css']
})
export class ReturnedDetailComponent implements OnInit {
  @Input() returnedId: any;
  loading = false;
  products = [];

  constructor(private borrowItemsService: BorrowItemsService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProductList(this.returnedId);
  }

  async getProductList(returnedId) {
    this.loading = true;
    try {
      const result: any = await this.borrowItemsService.getReturnedProducts(returnedId);
      this.loading = false;
      if (result.ok) {
        this.products = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

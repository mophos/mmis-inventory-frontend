import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssueTransactionService } from 'app/staff/issue-transaction.service';

@Component({
  selector: 'wm-issue-product',
  templateUrl: './issue-product.component.html'
})
export class IssueProductComponent implements OnInit {

    // @Input() data: any;
    data: any;
    loading = false;
    list = [];
    items: any;

    @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
    @Input('data')
    set setBaseUnitName(value: any) {
    this.items = value;
    }
    constructor(private issueService: IssueTransactionService, private alertService: AlertService) { }
  
    ngOnInit() {
      // this.getProductList(this.data);
      // console.log(this.data);
    }
    onChangeQty(qty, idx) {
      this.items[idx].product_qty = qty.value;
      this.onChange.emit(this.items);
    }
  async getProductList(genericId) {
      this.loading = true;
      try {
        const _data = {
          genericId : this.data.generic_id,
          genericQty: this.data.issue_qty * this.data.conversion_qty
        };
        const data_ = [];
        data_.push(_data);
        const result: any = await this.issueService.getIssuesProduct(data_);
        this.loading = false;
        if (result.ok) {
          this.list = result.rows;
          console.log(this.list);
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
import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-product-check-detail',
  templateUrl: './product-check-detail.component.html',
  styleUrls: ['./product-check-detail.component.css']
})
export class ProductCheckDetailComponent implements OnInit {
  @Input() receiveId: any;
  loading = false;
  products = [];
  
  constructor(private receiveService: ReceiveService, private alertService: AlertService) { }


  ngOnInit() {
    this.getProductList(this.receiveId);
  }

  getProductList(receiveId) {
    this.loading = true;
    // this.receiveService.getReceiveProductsCheckList(receiveId)
      // .then((result: any) => {
      //   this.loading = false;
      //   if (result.ok) {
      //     this.products = result.rows;
      //   } else {
      //     console.log(result.error);
      //     this.alertService.error(JSON.stringify(result.error));
      //   }
      // })
      // .catch(error => {
      //   this.loading = false;
      //   this.alertService.error(error.message);
      // });
  }

}

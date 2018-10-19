import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';
import { ProductsService } from './../../admin/products.service';


@Component({
  selector: 'wm-product-in-template-detail',
  templateUrl: './product-in-template-detail.component.html',
  styleUrls: ['./product-in-template-detail.component.css']
})
export class ProductInTemplateDetailComponent implements OnInit {
  @Input() templateId: any;
  @Input() ifIssue: any;
  loading = false;
  productsdetail = [];

  constructor(
    private ref: ChangeDetectorRef,
    private productService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.ifIssue ? 
    this.showAllProductsInTemplateIssue() :
    this.showAllProductsInTemplate();
  }

  showAllProductsInTemplate() {
    this.loading = true;
    this.productService.getProductsInTemplate(this.templateId)
      .then((result: any) => {
        if (result.ok) {
          this.productsdetail = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }
  showAllProductsInTemplateIssue() {
    this.loading = true;
    this.productService.getProductsInTemplateIssue(this.templateId)
      .then((result: any) => {
        if (result.ok) {
          this.productsdetail = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }
}

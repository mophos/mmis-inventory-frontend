import { ProductDetailComponent } from './../../grid-detail/product-detail/product-detail.component';
import { Component, OnInit, Inject, Output, Input, EventEmitter, ViewChild, Directive } from '@angular/core';
import { ProductsService } from './../products.service'
import { AlertService } from '../../alert.service';
import * as _ from 'lodash';
import { UploadingService } from '../../uploading.service';

@Component({
  selector: 'wm-code-mapping',
  templateUrl: './code-mapping.component.html',
  styles: []
})
export class CodeMappingComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('searchTMT') public searchTMT: any;

  products: any;
  productUpdate: any = [];
  openUpload = false;
  filePath: string;
  fileName: any = null;
  file: any;

  constructor(
    private uploadingService: UploadingService,
    private productsService: ProductsService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string,
  ) { }

  ngOnInit() {
    this.getAllProduct();
  }

  async getAllProduct() {
    this.modalLoading.show();
    try {
      const rs: any = await this.productsService.getAllProduct();
      this.products = rs.rows;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  changeSearchProduct(event, tmt) {
    // console.log(event, 'event');
    // console.log(tmt, 'tmt');
  }

  setSelectedProduct(event, m) {
    console.log(event);
    const idx = _.findIndex(this.products, { 'product_id': m.product_id });
    if (idx > -1) {
      this.products[idx].tmtid = event.tmtid;
    }
    console.log(this.products[idx]);
  }

  async save() {
    this.modalLoading.show();
    try {

      let items: any = [];
      this.products.forEach(v => {
        if (v.tmtid) {
          let obj: any = {};
          obj.working_code = v.working_code;
          obj.product_id = v.product_id;
          obj.tmt_id = v.tmtid;
          items.push(obj);
        }
      });

      if (items.length) {
        const rs = await this.productsService.updateTMT(items)
        this.modalLoading.hide();
        if (rs.ok) {
          this.alertService.success();
        } else {
          this.alertService.error(rs.error);
        }
      } else {
        this.alertService.error('ไม่พบรายการที่ต้องการบันทึก');
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async exportExcel() {
    let token = sessionStorage.getItem('token');
    let url = `${this.apiUrl}/products/mapping/tmt/export?token=${token}`;
    window.open(url, '_blank');
  }

  showUploadModal() {
    this.openUpload = true;
  }

  fileChangeEvent(fileInput: any) {
    this.file = <Array<File>>fileInput.target.files;
    this.fileName = this.file[0].name;
  }

  async doUpload() {
    try {
      this.modalLoading.show();
      this.uploadingService.uploadTmtMapping(this.file[0])
        .then((rs: any) => {

          if (rs.ok) {
            this.products = [];
            this.openUpload = false;
            this.products = rs.rows;
          } else {
            this.alertService.error(JSON.stringify(rs.error));
          }
          this.modalLoading.hide();
        }, (error) => {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        });
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  importExcel() {

  }
}

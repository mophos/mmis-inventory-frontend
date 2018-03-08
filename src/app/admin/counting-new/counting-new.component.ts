import { Router } from '@angular/router';
import { ReceiveService } from './../receive.service';
import { CountingService } from './../counting.service';
import { AlertService } from './../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-counting-new',
  templateUrl: './counting-new.component.html',
  styleUrls: ['./counting-new.component.css']
})
export class CountingNewComponent implements OnInit {
  wareHouses: any[] = [];
  warehouseId: any;
  products: any = [];
  productsPrepare: any = [];
  selectedProduct = [];
  selectedProduct2 = [];
  loading = false;
  countDate: any;
  modalPrint = false;
  isPreview = false;
  options: any;

  isPrintCounting = true;

  isSuccessPrepared = false;

  isPrepared = false;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  @ViewChild('viewer') viewer: any;

  constructor(
    private alertService: AlertService,
    private countingService: CountingService,
    private ref: ChangeDetectorRef,
    private receiveService: ReceiveService,
    private router: Router,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }

  ngOnInit() {
    // this.getProductAll();
    this.receiveService.getWarehouse()
      .then((result: any) => {
        if (result.ok) {
          this.wareHouses = result.rows;
        }
      });
  }

  printCounting() {

  }

  async saveCounting() {
    if (this.warehouseId) {
      try {
        this.alertService.confirm('ต้องการบันทึกการนับ ใช่หรือไม่?')
          .then(() => {
            const products = [];
            this.selectedProduct2.forEach(v => {
              const obj: any = {};
              obj.product_id = v.product_id;
              obj.wm_qty = v.qty;
              obj.lot_id = v.lot_id;
              products.push(obj);
            });

            const summaryData: any = {
              warehouseId: this.warehouseId,
              countDate: moment(new Date(this.countDate.jsdate)).format('YYYY-MM-DD')
            };

            this.countingService.saveCounting(summaryData, products)
              .then((resp: any) => {
                if (resp.ok) {
                  this.router.navigate(['/admin/counting']);
                  this.isSuccessPrepared = true;
                } else {
                  this.alertService.error(JSON.stringify(resp.error));
                }
              })
              .catch(() => {
                this.alertService.serverError();
              });

          })
          .catch(() => { });
      } catch (error) {
        this.alertService.error(error.message);
      }
    } else {
      this.alertService.error('กรุณาเลือกคลังสินค้า');
    }
  }

  async getProductAllByWarehouse() {
    try {
      if (this.warehouseId) {
        this.loading = true;
        const resp = await this.countingService.allByWarehouse(this.warehouseId);
        if (resp.ok) {
          this.products = resp.rows;
          this.isPrepared = false;
          this.selectedProduct2 = [];
          this.selectedProduct = [];
          this.ref.detectChanges();
        } else {
          this.alertService.error(JSON.stringify(resp.error));
        }
        this.loading = false;
      } else {
        this.alertService.error('กรุณาระบุคลังสินค้าที่ต้องการตรวจนับ');
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  doPrepare() {
    this.isPrepared = true;
    this.productsPrepare = _.clone(this.selectedProduct);
  }

  cancelPrepare() {
    this.productsPrepare = [];
    this.isPrepared = false;
  }

}

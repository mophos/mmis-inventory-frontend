import { CountingService } from './../counting.service';
import { AlertService } from './../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-counting-verify',
  templateUrl: './counting-adjust.component.html',
  styleUrls: ['./counting-adjust.component.css']
})
export class CountingAdjustComponent implements OnInit {
  openModalAdjust = false;
  adjQty = 0;

  @ViewChild('modalAdjust') modalAdjust: any;

  productNewId: any;
  checkDate: any;
  wareHouses: any[] = [];
  warehouseId: any;
  products: any = [];
  loading = false;
  verifyDate: any;
  peopleId: any;
  modalPrint = false;
  isPreview = false;
  options: any;
  isPrintCounting = true;

  people = [];

  countId: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    private alertService: AlertService,
    private countingService: CountingService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
    this.countId = this.route.snapshot.params['countId'];
  }

  ngOnInit() {
    this.getProductList();
    this.getPeople();
  }

  async getPeople() {
    try {
      const resp = await this.countingService.getPeoples();
      if (resp.ok) {
        this.people = resp.rows;
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async getProductList() {
    try {
      this.loading = true;
      const resp = await this.countingService.getProductListByCountingForAdjust(this.countId);
      if (resp.ok) {
        // this.products = resp.rows;
        _.forEach(resp.rows, (v: any) => {
          const obj: any = {};
          obj.product_new_id = v.product_new_id;
          obj.product_id = v.product_id;
          obj.product_name = v.product_name;
          obj.wm_qty = +v.wm_qty;
          obj.check_qty = +v.check_qty;
          obj.remain_qty = +v.check_qty - +v.wm_qty;
          obj.lot_no = v.lot_no;
          obj.count_detail_id = v.count_detail_id;
          obj.small_unit = v.small_unit;
          obj.large_unit = v.large_unit;
          obj.isAdjust = v.confirmed === 'Y' ? 'Y' : 'N';

          this.products.push(obj);
        });
        this.ref.detectChanges();
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  changeCheckQty(idx: any, checkQty: number) {
    this.products[idx].remain_qty = +this.products[idx].wm_qty - +checkQty;
    this.products[idx].check_qty = +checkQty;
  }

  saveAdjustCounting() {

    this.alertService.confirm('คุณต้องการบันทึกการเปลี่ยนสถานะรายการเป็น "ปรับยอดแล้ว" ใช่หรือไม่?')
      .then(() => {
        this.countingService.updateAdjustStatus(this.countId)
          .then((result: any) => {
            if (result.ok) {
              this.router.navigate(['/admin/counting']);
            } else {
              this.alertService.error(JSON.stringify(result.error));
            }
          })
          .catch((error: any) => {
            this.alertService.serverError();
          });
      })
      .catch(() => { });
  }

  cancelVerify() {
    this.router.navigate(['/admin/counting']);
  }

  doAdjust(productNewId, adjQty) {
    this.productNewId = productNewId;
    this.modalAdjust.getProductDetail(productNewId, adjQty);
    this.openModalAdjust = true;
  }

  async successAdjust(event) {
    if (event) {
      const idx = _.findIndex(this.products, { product_new_id: this.productNewId });
      if (idx > -1) {
        try {
          await this.countingService.saveConfirmed(this.products[idx].count_detail_id);
          this.products[idx].isAdjust = 'Y';
        } catch (error) {
          this.alertService.error('ไม่สามารถเปลี่ยนสถานะได้');
        }
      }
    }
    this.openModalAdjust = false;
  }

}


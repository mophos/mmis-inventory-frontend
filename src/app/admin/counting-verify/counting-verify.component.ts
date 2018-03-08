import { CountingService } from './../counting.service';
import { AlertService } from './../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-counting-verify',
  templateUrl: './counting-verify.component.html',
  styleUrls: ['./counting-verify.component.css']
})
export class CountingVerifyComponent implements OnInit {

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
      const resp = await this.countingService.getProductListByCounting(this.countId);
      if (resp.ok) {
        // this.products = resp.rows;
        _.forEach(resp.rows, (v: any) => {
          const obj: any = {};
          obj.product_id = v.product_id;
          obj.working_code = v.working_code;
          obj.product_name = v.product_name;
          obj.wm_qty = +v.wm_qty;
          obj.check_qty = 0;
          obj.remain_qty = 0;
          obj.lot_no = v.lot_no;
          obj.count_detail_id = v.count_detail_id;
          obj.base_unit_name = v.base_unit_name;
          obj.large_unit = v.large_unit;

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
    this.products[idx].remain_qty = +checkQty - +this.products[idx].wm_qty;
    this.products[idx].check_qty = +checkQty;
  }

  saveCheckCounting() {
    const verifyDate = moment(new Date(this.verifyDate.jsdate)).format('YYYY-MM-DD');

    this.alertService.confirm('คุณต้องการบันทึกการตรวจสอบ ใช่หรือไม่?')
      .then(() => {
        this.countingService.saveVerify(this.countId, verifyDate, this.products)
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


}

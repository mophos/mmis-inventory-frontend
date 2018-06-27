import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ProductsService } from '../products.service';
import { BasicService } from 'app/basic.service';
import { IssueService } from 'app/admin/issue.service';

@Component({
  selector: 'wm-issues-edit',
  templateUrl: './issues-edit.component.html',
  styles: []
})
export class IssuesEditComponent implements OnInit {

  lots: any = [];
  products = [];
  issueDate = null;
  transactionId: null;
  issues: any = [];
  comment: any = null;
  remainQty = 0;

  primaryUnitId: null;
  primaryUnitName: null;

  productId: any = null;
  productName: any = null;
  genericId: any;

  issueQty = 0;
  expiredDate: any = null;
  lotNo: any;
  conversionQty: number = 0;
  unitGenericId: null;
  genericName: any;
  warehouseId: any;
  warehouseName: any;
  refDocument: any;

  @ViewChild('unitList') public unitList: any;
  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('lotList') public lotList: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('modalLoading') public modalLoading: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  token: any;
  jwtHelper: JwtHelper = new JwtHelper();

  issueId: any;
  issueCode: any;

  constructor(
    private toThaiDate: ToThaiDatePipe,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private basicService: BasicService,
    private issueService: IssueService,
    @Inject('API_URL') private apiUrl: string,
    private zone: NgZone
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.route.queryParams
      .subscribe(params => {
        this.issueId = params.issueId;
      });

    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
    const date = new Date();

    // this.issueDate = {
    //   date: {
    //     year: date.getFullYear(),
    //     month: date.getMonth() + 1,
    //     day: date.getDate()
    //   }
    // };

    this.getTransactionaIssues();

    this.getProductList();
    this.getSummary();
  }

  async getProductList() {
    try {
      this.modalLoading.show();
      const productList = await this.issueService.getEditProductList(this.issueId);
      const genericList = await this.issueService.getEditGenericList(this.issueId);
      console.log(productList);

      // console.log(rs);
      let items = [];
      let objP: any = {};
      let obj: any = {};
      // console.log(genericList.rows);

      if (genericList.ok) {
        for (const v of genericList.rows) {
          items = [];
          obj = {};
          obj.remain_qty = v.generic_remain_qty;
          obj.issue_qty = +v.generic_qty;
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.conversion_qty = +v.generic_conversion;
          obj.unit_generic_id = v.unit_generic_id;
          // const _productList = _.filter(productList.rows, { 'generic_id': v.generic_id })
          for (const e of productList.rows) {
            console.log(e.generic_id, v.generic_id);

            if (e.generic_id === v.generic_id) {
              objP = {};
              objP.product_id = e.product_id;
              objP.product_name = e.product_name;
              objP.product_qty = e.product_qty;
              objP.generic_id = e.generic_id;
              objP.conversion_qty = e.product_conversion;
              objP.small_remain_qty = e.product_remain_qty;
              objP.wm_product_id = e.wm_product_id;
              objP.from_unit_name = e.from_unit_name;
              objP.to_unit_name = e.to_unit_name;
              items.push(objP);
              // console.log(items);
            }
          }

          obj.items = items;
          // console.log(obj);

          this.products.push(obj);
        }

        // console.log(this.products);


      } else {
        this.alertService.error(productList.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getTransactionaIssues() {
    const rs = await this.basicService.getTransactionIssues();
    this.issues = rs.rows;
  }

  async getSummary() {
    try {
      let rs = await this.issueService.getSummary(this.issueId);
      if (rs.ok) {
        if (rs.rows.issue_date) {
          this.issueDate = {
            date: {
              year: moment(rs.rows.issue_date).get('year'),
              month: moment(rs.rows.issue_date).get('month') + 1,
              day: moment(rs.rows.issue_date).get('date')
            }
          };
        }

        this.issueCode = rs.rows.issue_code ? rs.rows.issue_code : null;
        this.transactionId = rs.rows.transaction_issue_id ? rs.rows.transaction_issue_id : null;
        this.refDocument = rs.rows.ref_document ? rs.rows.ref_document : null;
        this.comment = rs.rows.comment ? rs.rows.comment : null;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelectedProduct(event: any) {
    try {
      this.productId = event ? event.product_id : null;
      this.productName = event ? `${event.product_name} (${event.generic_name})` : null;
      this.primaryUnitId = event ? event.primary_unit_id : null;
      this.primaryUnitName = event ? event.primary_unit_name : null;
      this.remainQty = event ? event.qty - event.reserve_qty : 0;
      this.genericName = event ? event.generic_name : null;
      this.genericId = event ? event.generic_id : null;
      this.getLots();
      this.unitList.setGenericId(this.genericId);
    } catch (error) {
      console.log(error.message);
    }
  }

  changeUnit(event: any) {
    try {
      this.conversionQty = event.qty ? event.qty : 0;
      this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
    } catch (error) {
      //
    }
  }

  changeLots(event: any) {
    try {
      const idx = _.findIndex(this.lots, { lot_no: this.lotNo });
      if (idx > -1) {
        this.expiredDate = this.lots[idx].expired_date;
        this.remainQty = this.lots[idx].qty;
      }
    } catch (error) {
      //
    }
  }

  clearProductSearch() {
    this.productId = null;
  }

  async getLots() {
    try {
      const rs = await this.issueService.getLots(this.productId, this.warehouseId);
      this.lots = rs.rows;
    } catch (error) {
      console.error(error);
    }
  }

  async addProduct() {
    const idx = _.findIndex(this.products, { generic_id: this.genericId });
    if (idx > -1) {
      const newQty = +this.products[idx].issue_qty + +this.issueQty;
      if (newQty > +this.products[idx].remain_qty) {
        this.products[idx].issue_qty = this.products[idx].remain_qty;
      } else {
        this.products[idx].issue_qty = newQty;
      }
    } else {

      if (this.remainQty < this.issueQty) {
        this.alertService.error('จำนวนจ่าย มากกว่าจำนวน คงเหลือ');
      } else {
        const obj: any = {};
        obj.issue_qty = +this.issueQty;
        obj.generic_id = this.genericId;
        obj.generic_name = this.genericName;
        obj.remain_qty = +this.remainQty;
        obj.conversion_qty = +this.conversionQty;
        obj.unit_generic_id = this.unitGenericId;
        obj.warehouse_id = this.warehouseId;
        obj.items = [];
        this.products.push(obj);
        await this.alowcate(this.genericId);
      }
    }
    this.clearForm();
  }
  async alowcate(genericId) {
    try {
      const data_ = [];
      const idx = _.findIndex(this.products, { generic_id: genericId });
      if (idx > -1) {
        const _data = {
          genericId: this.products[idx].generic_id,
          genericQty: this.products[idx].issue_qty * this.products[idx].conversion_qty
        };
        data_.push(_data);
      }
      const result: any = await this.issueService.getIssuesProduct(data_);
      if (result.ok) {
        const list = result.rows;
        if (idx > -1) {
          this.products[idx].items = list;
        }
        console.log(list);
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  editChangeIssueQty(idx: any, qty: any) {
    // const oldQty = +this.products[idx].issue_qty;
    if (+qty.value > +this.products[idx].qty) {
      this.alertService.error('จำนวนจ่าย มากกว่าจำนวนคงเหลือ');
      qty.value = this.products[idx].qty;
    } else {
      this.products[idx].issue_qty = +qty.value;
    }
    this.alowcate(this.products[idx].generic_id);
  }

  editChangeUnit(idx: any, event: any, unitCmp: any) {
    if (this.products[idx].qty < (this.products[idx].issue_qty * event.conversion_qty)) {
      this.alertService.error('รายการไม่พอจ่าย');
      unitCmp.getUnits(this.products[idx].generic_id);
      unitCmp.setSelectedUnit(this.products[idx].unit_generic_id);
    } else {
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
    }
    // console.log(this.products);

  }

  removeSelectedProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.products.splice(idx, 1);
      }).catch(() => { });
  }

  clearForm() {
    this.remainQty = 0;
    this.issueQty = 0;
    this.lotNo = null;
    this.productId = null;
    this.genericId = null;
    this.productName = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.expiredDate = null;
    this.unitGenericId = null;
    this.conversionQty = 0;

    this.unitList.clearUnits();
    this.lots = [];
    this.productSearch.clearProductSearch();
  }

  saveIssue() {
    this.alertService.confirm('ต้องการบันทึกรายการ ตัดจ่าย ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        const summary: any = {};
        summary.issueDate = this.issueDate ? `${this.issueDate.date.year}-${this.issueDate.date.month}-${this.issueDate.date.day}` : null;
        summary.transactionId = this.transactionId;
        summary.comment = this.comment;
        summary.refDocument = this.refDocument;
        this.issueService.updateIssue(this.issueId, summary, this.products)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/issues']);
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          });
      }).catch(() => { });
  }
  setSelectedGeneric(e) {
    e.issue_qty = 0;
    this.products.push(e);
  }

  changeQtyGrid(e) {
    let total_base = 0;
    e.forEach(v => {
      total_base += (+v.product_qty);
    });

    const idx = _.findIndex(this.products, { generic_id: e[0].generic_id });
    if (idx > -1) {
      const qty = Math.floor(total_base / +this.products[idx].conversion_qty);
      this.products[idx].issue_qty = qty;
    }
  }

}

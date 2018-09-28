import { PeriodService } from 'app/period.service';
import { ToolsService } from './../../tools.service';

import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import * as _ from 'lodash';
import * as moment from 'moment';

import { ProductsService } from 'app/admin/products.service';
import { BasicService } from 'app/basic.service';
import { IssueService } from 'app/admin/issue.service';

@Component({
  selector: 'wm-stockcard-issue',
  templateUrl: './stockcard-issue.component.html',
  styles: []
})
export class StockcardIssueComponent implements OnInit {

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
  conversionQty = 0;
  unitGenericId: null;
  genericName: any;
  warehouseId: any;
  warehouseName: any;
  refDocument: any;

  isSaving = false;
  password: any;
  passwordModal = false;
  checkEnterPass = true;
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
    private zone: NgZone,
    private toolsService: ToolsService,
    private periodService: PeriodService
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
    this.getTransactionaIssues();

    this.getProductList();
    this.getSummary();
  }

  async getProductList() {
    try {
      this.modalLoading.show();
      const productList = await this.issueService.getEditProductList(this.issueId);
      const genericList = await this.issueService.getEditGenericList(this.issueId);
      let items = [];
      let objP: any = {};
      let obj: any = {};
      console.log(genericList.rows);

      if (genericList.ok) {
        for (const v of genericList.rows) {
          items = [];
          obj = {};
          obj.remain_qty = (v.generic_remain_qty + (+v.generic_qty * +v.generic_conversion));
          obj.issue_qty = +v.generic_qty;
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.conversion_qty = +v.generic_conversion;
          obj.unit_generic_id = v.unit_generic_id;
          obj.issue_generic_id = v.issue_generic_id;
          for (const e of productList.rows) {
            if (e.generic_id === v.generic_id) {
              objP = {};
              objP.product_id = e.product_id;
              objP.product_name = e.product_name;
              objP.product_qty = e.product_qty;
              objP.product_qty_old = e.product_qty;
              objP.generic_id = e.generic_id;
              objP.conversion_qty = e.product_conversion;
              objP.small_remain_qty = e.product_remain_qty + e.product_qty;
              objP.wm_product_id = e.wm_product_id;
              objP.from_unit_name = e.from_unit_name;
              objP.to_unit_name = e.to_unit_name;
              objP.issue_product_id = e.issue_product_id;
              objP.lot_no = e.lot_no;
              items.push(objP);
            }
          }
          obj.items = items;
          this.products.push(obj);
        }
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
      const rs = await this.issueService.getSummary(this.issueId);
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
        this.warehouseId = rs.rows.warehouse_id;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }


  async getLots() {
    try {
      const rs = await this.issueService.getLots(this.productId, this.warehouseId);
      this.lots = rs.rows;
    } catch (error) {
      console.error(error);
    }
  }

  // async alowcate(genericId) {
  //   try {
  //     const data_ = [];
  //     const idx = _.findIndex(this.products, { generic_id: genericId });
  //     if (idx > -1) {
  //       const _data = {
  //         genericId: this.products[idx].generic_id,
  //         genericQty: this.products[idx].issue_qty * this.products[idx].conversion_qty
  //       };
  //       data_.push(_data);
  //     }
  //     const result: any = await this.issueService.getIssuesProduct(data_);
  //     if (result.ok) {
  //       const list = result.rows;
  //       if (idx > -1) {
  //         this.products[idx].items = list;
  //       }
  //     } else {
  //       console.log(result.error);
  //       this.alertService.error();
  //     }
  //   } catch (error) {
  //     this.alertService.error(error.message);
  //   }
  // }

  editChangeIssueQty(idx: any, qty: any) {
    console.log(qty.value);

    if (+qty.value > 0) {
      if (+qty.value > +this.products[idx].qty) {
        this.alertService.error('จำนวนจ่าย มากกว่าจำนวนคงเหลือ');
        qty.value = this.products[idx].qty;
      } else {
        this.products[idx].issue_qty = +qty.value;
      }
    } else if (qty.value === "0") {
      this.alertService.error('จำนวนต้องมากกว่า 0')
    }
    // this.alowcate(this.products[idx].generic_id);
  }

  editChangeUnit(idx: any, event: any, unitCmp: any) {
    if (+event.qty > 0) {
      if (this.products[idx].qty < (this.products[idx].issue_qty * event.conversion_qty)) {
        this.alertService.error('รายการไม่พอจ่าย');
        unitCmp.getUnits(this.products[idx].generic_id);
        unitCmp.setSelectedUnit(this.products[idx].unit_generic_id);
      } else {
        this.products[idx].unit_generic_id = event.unit_generic_id;
        this.products[idx].conversion_qty = event.qty;
      }
    } else if (+event.qty === 0) {
      this.alertService.error('จำนวนต้องมากกว่า 0')
    }
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

  enterSave(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.save();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }

  async save() {
    try {
      let isZero = false;
      this.products.forEach(v => {
        if (+v.issue_qty === 0) {
          isZero = true;
        }
      });

      if (!isZero) {
        if (this.password) {
          const rsC = await this.toolsService.checkPassword(this.password);
          if (rsC.ok) {
            this.modalLoading.show();
            this.isSaving = true;
            const _issueDate = this.issueDate ? `${this.issueDate.date.year}-${this.issueDate.date.month}-${this.issueDate.date.day}` : null;
            const rsP = await this.periodService.getStatus(_issueDate)
            if (rsP.rows[0].status_close === 'Y') {
              this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถแก้ไข stockcard ได้');
              this.isSaving = false;
            } else {
              const summary = {
                warehouse_id: this.warehouseId,
                transaction_issue_id: this.transactionId,
                comment: this.comment,
                ref_document: this.refDocument,
                issue_date: _issueDate
              }
              const rs: any = await this.toolsService.saveIssue(this.issueId, summary, this.products);
              if (rs.ok) {
                this.modalLoading.hide();
                this.router.navigate(['admin/tools/stockcard']);
                this.isSaving = false;
              } else {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error(JSON.stringify(rs.error));
              }
            }
          } else {
            this.isSaving = false;
            this.modalLoading.hide();
            this.passwordModal = false;
            this.alertService.error('รหัสผ่านผิดพลาด');
          }
        } else {
          this.isSaving = false;
          this.modalLoading.hide();
          this.alertService.error('ข้อมูลไม่สมบูรณ์');
        }
      } else {
        this.isSaving = false;
        this.modalLoading.hide();
        this.passwordModal = false;
        this.alertService.error('มีจำนวนเป็น 0');
      }

    } catch (error) {
      this.alertService.error(error);
    }
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

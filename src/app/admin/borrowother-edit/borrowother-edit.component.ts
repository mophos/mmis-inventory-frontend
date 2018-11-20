import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

import * as _ from 'lodash';

import { BasicService } from 'app/basic.service';
import { BorrowOtherService } from 'app/admin/borrow-other.service';
import { PeriodService } from './../../period.service';

@Component({
  selector: 'wm-borrowother-edit',
  templateUrl: './borrowother-edit.component.html',
  styleUrls: []
})
export class BorrowotherEditComponent implements OnInit {

  openUpload = false;
  fileName: any = null;
  file: any;

  products = [];
  borrowDate = null;
  transactionId: null;
  borrow: any = [];
  comment: any = null;
  remainQty = 0;
  lots: any = [];
  listIssues: any;
  hlistIssues: any;
  objProduct: any;

  srcWarehouseName: string;
  primaryUnitId: null;
  primaryUnitName: null;
  isOpenModal = false;

  productId: any = null;
  productName: any = null;
  genericName: any = null;
  genericId: any;

  borrowQty: any;
  expiredDate: any = null;
  lotNo: any;
  conversionQty = 0;
  unitGenericId: null;

  warehouseId: any;
  refDocument: any;
  borrowId: any;

  @ViewChild('unitList') public unitList: any;
  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('data') public data: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private basicService: BasicService,
    private borrowOtherService: BorrowOtherService,
    @Inject('API_URL') private apiUrl: string,
    private zone: NgZone,
    private periodService: PeriodService
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(token);
    this.warehouseId = decodedToken.warehouseId;
    this.route.queryParams
      .subscribe(params => {
        this.borrowId = params.borrowId;
      });
  }

  ngOnInit() {


    const date = new Date();

    this.borrowDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.getProductList();
    this.getWarehouses();
    // this.getTransactionaIssues();
  }

  async getWarehouses(){
    const rs = await this.borrowOtherService.getWarehouses(this.borrowId);
    this.srcWarehouseName = rs.rows.src_warehouse_name;
    this.comment = rs.rows.comment;
  }

  // async getTransactionaIssues() {
  //   const rs = await this.basicService.getTransactionIssues();
  //   this.borrow = rs.rows;
  // }

  async getProductList() {
    try {
      this.modalLoading.show();
      const productList = await this.borrowOtherService.getEditProductList(this.borrowId);
      const genericList = await this.borrowOtherService.getEditGenericList(this.borrowId);
      let items = [];
      let objP: any = {};
      let obj: any = {};
      if (genericList.ok) {
        for (const v of genericList.rows) {
          items = [];
          obj = {};
          obj.remain_qty = v.generic_remain_qty;
          obj.borrow_qty = +v.generic_qty;
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.conversion_qty = +v.generic_conversion;
          obj.unit_generic_id = v.unit_generic_id;
          for (const e of productList.rows) {
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
            }
          }
          obj.items = items;
          this.products.push(obj);
        }
        console.log(this.products);
        
      } else {
        this.alertService.error(productList.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  setSelectedProduct(event: any) {
    try {
      this.productId = event ? event.product_id : null;
      this.genericName = event ? `${event.generic_name}` : null;
      this.genericId = event ? event.generic_id : null;
      this.unitList.setGenericId(this.genericId);
      this.remainQty = event.qty;
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

  clearProductSearch() {
    this.productId = null;
  }

  async addProduct() {

    const idx = _.findIndex(this.products, { generic_id: this.genericId });
    if (idx > -1) {
      this.alertService.success('รายการซ้ำ', 'จำนวนจะไปเพิ่มในรายการเดิม');
      const newQty = +this.products[idx].borrow_qty + +this.borrowQty;
      if (newQty > +this.products[idx].remain_qty) {
        this.products[idx].borrow_qty = this.products[idx].remain_qty;
      } else {
        this.products[idx].borrow_qty = newQty;
      }
    } else {
      if (this.remainQty < this.borrowQty) {
        this.alertService.error('จำนวนจ่าย มากกว่าจำนวน คงเหลือ');
      } else {
        const obj: any = {};
        obj.borrow_qty = +this.borrowQty;
        obj.generic_id = this.genericId;
        obj.generic_name = this.genericName;
        obj.remain_qty = +this.remainQty;
        obj.conversion_qty = +this.conversionQty;
        obj.unit_generic_id = this.unitGenericId;
        obj.warehouse_id = this.warehouseId;
        obj.items = [];
        this.products.push(obj);
        await this.alowcate(this.genericId);
        console.log(this.products);

      }
    }
    this.clearForm();
  }
  async alowcate(genericId) {
    try {
      const idx = _.findIndex(this.products, { generic_id: genericId })
      let _data = {};

      if (idx > -1) {
        _data = {
          genericId: this.products[idx].generic_id,
          genericQty: this.products[idx].borrow_qty * this.products[idx].conversion_qty
        };
      }

      const data_ = [];
      data_.push(_data);

      const result: any = await this.borrowOtherService.getIssuesProduct(data_);
      if (result.ok) {
        const list = result.rows;
        const idxp = _.findIndex(this.products, { generic_id: genericId })
        if (idxp > -1) {
          this.products[idxp].items = list;
        }

      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  editChangeBorrowQty(idx: any, qty: any) {
    if ((+qty.value * this.products[idx].conversion_qty) > +this.products[idx].remain_qty) {
      this.alertService.error('จำนวนจ่าย มากกว่าจำนวนคงเหลือ');
      this.products[idx].borrow_qty = '';
    } else {
      this.products[idx].borrow_qty = +qty.value;
      this.alowcate(this.products[idx].generic_id);
    }
  }

  async editChangeUnit(idx: any, event: any, unitCmp: any) {
    if (this.products[idx].remain_qty < (this.products[idx].borrow_qty * event.qty)) {
      this.products[idx].borrow_qty = 0;
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
      unitCmp.getUnits(this.products[idx].generic_id);
    } else {
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
      await this.alowcate(event.generic_id);
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
    this.borrowQty = '';
    this.lotNo = null;
    this.productId = null;
    this.genericId = null;
    this.productName = null;
    this.expiredDate = null;
    this.unitGenericId = null;
    this.conversionQty = 0;

    this.unitList.clearUnits();
    this.lots = [];
    this.productSearch.clearProductSearch();
  }

  saveIssue() {
    this.alertService.confirm('ต้องการบันทึกรายการ ยืม ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        console.log(this.srcWarehouseName);
        
        const summary: any = {};
        summary.borrowDate = this.borrowDate ? `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}` : null;
        summary.srcWarehouseName = this.srcWarehouseName;
        summary.transactionId = this.transactionId;
        summary.comment = this.comment;
        summary.refDocument = this.refDocument;
        this.borrowOtherService.updateIssue(this.borrowId, summary, this.products)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/borrow']);
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

  openModal() {
    this.isOpenModal = true;
    this.getIssues();
  }

  async getIssues() {
    try {
      const res = await this.borrowOtherService._getIssues(this.warehouseId)
      if (res.ok) {
        this.hlistIssues = res.rows;
      } else {
        this.alertService.error(res.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async addIssue(id: any) {
    this.products = []
    this.isOpenModal = false;
    try {
      const res = await this.borrowOtherService.getProductIssues(id)
      if (res.ok) {
        this.objProduct = res.rows;
        for (const v of this.objProduct) {
          const obj: any = {};
          obj.borrow_qty = 0;
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;
          obj.remain_qty = +v.remain_qty;
          obj.conversion_qty = +v.conversion_qty;
          obj.unit_generic_id = v.unit_generic_id;
          obj.warehouse_id = this.warehouseId;
          this.products.push(obj);
          await this.alowcate(v.generic_id);
        }
      } else {
        this.alertService.error(res.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  // file upload
  showUploadModal() {
    this.openUpload = true;
  }

  fileChangeEvent(fileInput: any) {
    this.file = <Array<File>>fileInput.target.files;
    this.fileName = this.file[0].name;
  }

  async getAllowcateData(data) {
    const result: any = await this.borrowOtherService.getIssuesProduct(data);
    if (result.ok) {
      const list = result.rows;
      this.products.forEach((v, i) => {
        const idx = _.findIndex(list, { generic_id: v.generic_id });
        if (idx > -1) {
          this.products[i].items.push(list[idx]);
        }
      });

    } else {
      console.log(result.error);
      this.alertService.error();
    }
  }

  setSelectedGeneric(e) {
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
      this.products[idx].borrow_qty = qty;
    }

  }
}
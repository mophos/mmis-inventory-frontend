import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { PeriodService } from '../../period.service';

import * as _ from 'lodash';

import { ProductsService } from '../products.service';
import { BasicService } from 'app/basic.service';
import { IssueService } from 'app/admin/issue.service';
import { SettingService } from '../../setting.service';
import { UploadingService } from 'app/uploading.service';

@Component({
  selector: 'wm-issues-new',
  templateUrl: './issues-new.component.html',
  styles: []
})
export class IssuesNewComponent implements OnInit {
  products = [];
  issueDate = null;
  transactionId: null;
  issues: any = [];
  comment: any = null;
  remainQty = 0;
  isSaving = false;
  lots: any = [];
  objProduct: any = [];
  hlistIssues: any;

  primaryUnitId: null;
  primaryUnitName: null;

  productId: any = null;
  productName: any = null;
  genericId: any;

  issueQty: any;
  expiredDate: any = null;
  lotNo: any;
  conversionQty = 0;
  unitGenericId: null;

  warehouseId: any;
  warehouseName: any;
  refDocument: any;
  openHistory = false;
  genericName: any;
  isApprove: any;

  openUpload = false;
  filePath: string;
  fileName: any = null;
  file: any;

  isImport = false;

  isOpenModal = false;
  reserveQty;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('lotList') public lotList: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('data') public data: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  token: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private toThaiDate: ToThaiDatePipe,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductsService,
    private basicService: BasicService,
    private issueService: IssueService,
    private uploadingService: UploadingService,
    @Inject('API_URL') private apiUrl: string,
    private zone: NgZone,
    private periodService: PeriodService,
    private settingService: SettingService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
    const date = new Date();

    this.issueDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.getTransactionaIssues();
  }

  async getTransactionaIssues() {
    const rs = await this.basicService.getTransactionIssues();
    this.issues = rs.rows;
  }

  onEditChangeLots(event: any, idx: any) {
    console.log(event);
    this.products[idx].lot_no = event.lot_no;
    this.products[idx].expired_date = event.expired_date;
    this.products[idx].unit_generic_id = event.unit_generic_id;
    this.products[idx].remain_qty = event.qty;
    this.products[idx].conversion_qty = event.conversion_qty;
  }

  setSelectedProduct(event: any) {
    try {
      this.productId = event ? event.product_id : null;
      this.genericName = event ? `${event.generic_name}` : null;
      this.genericId = event ? event.generic_id : null;
      this.unitList.setGenericId(this.genericId);
      this.remainQty = event.qty;
      this.reserveQty = event.qty - event.reserve_qty;
      this.primaryUnitName = event.primary_unit_name;
      console.log(event);

    } catch (error) {
      console.log(error.message);
    }
  }

  async changeUnit(event: any) {
    try {
      this.conversionQty = event.qty ? event.qty : 0;
      this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
    } catch (error) {
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
    }
  }

  clearProductSearch() {
    this.productId = null;
  }

  async getLots() {
    try {
      const rs = await this.issueService.getLots(this.productId, this.warehouseId);
      this.lots = rs.rows;
      this.remainQty = _.sumBy(this.lots, 'qty');
      console.log(this.lots);
      console.log(this.remainQty);

    } catch (error) {
      console.error(error);
    }
  }

  async addProduct() {

    const idx = _.findIndex(this.products, { generic_id: this.genericId });
    if (idx > -1) {
      this.alertService.success('รายการซ้ำ', 'จำนวนจะไปเพิ่มในรายการเดิม');
      const newQty = +this.products[idx].issue_qty + +this.issueQty;
      if (newQty > +this.products[idx].remain_qty) {
        this.products[idx].issue_qty = this.products[idx].remain_qty;
      } else {
        this.products[idx].issue_qty = newQty;
      }
      await this.alowcate(this.genericId);
    } else {

      if (this.remainQty < this.issueQty) {
        this.alertService.error('จำนวนจ่าย มากกว่าจำนวน คงเหลือ');
      } else {
        const obj: any = {};
        obj.issue_qty = +this.issueQty;
        obj.generic_id = this.genericId;
        obj.generic_name = this.genericName;
        obj.remain_qty = +this.remainQty;
        obj.reserve_qty = +this.reserveQty;
        obj.conversion_qty = +this.conversionQty;
        obj.unit_generic_id = this.unitGenericId;
        obj.warehouse_id = this.warehouseId;
        obj.unit_name = this.primaryUnitName;
        obj.items = [];
        this.products.push(obj);
        // console.log(this.products);
        await this.alowcate(this.genericId);
      }
    }
    this.clearForm();
  }

  async alowcate(genericId) {
    this.modalLoading.show();
    try {
      if (this.products) {
        let idx = _.findIndex(this.products, { generic_id: genericId })
        let _data = {};

        if (idx > -1) {
          _data = {
            genericId: this.products[idx].generic_id,
            unitGenericId: this.products[idx].unit_generic_id,
            genericQty: this.products[idx].issue_qty * this.products[idx].conversion_qty
          };
        }

        const data_ = [];
        data_.push(_data);

        const result: any = await this.issueService.getIssuesProduct(data_);
        if (result.ok) {
          const list = result.rows;
          list.forEach(v => {
            v.unit_generic_id = this.products[idx].unit_generic_id
          });
          idx = _.findIndex(this.products, { generic_id: genericId })
          if (idx > -1) {
            this.products[idx].items = list;
          }
        } else {
          console.log(result.error);
          this.alertService.error();
        }
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  editChangeIssueQty(idx: any, qty: any) {
    // const oldQty = +this.products[idx].issue_qty;
    console.log(this.products);

    if ((+qty.value * this.products[idx].conversion_qty) > +this.products[idx].reserve_qty) {
      this.alertService.error('จำนวนจ่าย มากกว่าจำนวนคงเหลือ');
      this.products[idx].issue_qty = '';
    } else {
      this.products[idx].issue_qty = +qty.value;
      this.alowcate(this.products[idx].generic_id);
    }
  }

  async editChangeUnit(idx: any, event: any, unitCmp: any) {
    if (this.products[idx].remain_qty < (this.products[idx].issue_qty * event.qty)) {
      this.products[idx].issue_qty = 0;
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
      unitCmp.getUnits(this.products[idx].generic_id);
    } else {
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
      await this.alowcate(event.generic_id);
      console.log(this.products);

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
    this.issueQty = '';
    this.lotNo = null;
    this.productId = null;
    this.genericId = null;
    this.productName = null;
    // this.primaryUnitId = null;
    // this.primaryUnitName = null;
    this.expiredDate = null;
    this.unitGenericId = null;
    this.conversionQty = 0;
    this.reserveQty = 0;
    this.unitList.clearUnits();
    this.lots = [];
    this.productSearch.clearProductSearch();
  }

  async saveIssue() {
    const issueDate = this.issueDate ? `${this.issueDate.date.year}-${this.issueDate.date.month}-${this.issueDate.date.day}` : null;
    const rs = await this.periodService.getStatus(issueDate);
    if (rs.rows[0].status_close === 'Y') {
      this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถตัดจ่ายได้')
    } else {
      this.alertService.confirm('ต้องการบันทึกรายการ ตัดจ่าย ใช่หรือไม่?')
        .then(() => {
          this.modalLoading.show();
          const summary: any = {};
          summary.issueDate = this.issueDate ? `${this.issueDate.date.year}-${this.issueDate.date.month}-${this.issueDate.date.day}` : null;
          summary.transactionId = this.transactionId;
          summary.comment = this.comment;
          summary.refDocument = this.refDocument;

          // check product remain
          let isError = false;
          this.products.forEach(v => {
            const totalIssue = v.issue_qty * v.conversion_qty;
            if (totalIssue > v.remain_qty || v.issue_qty <= 0) {
              isError = true;
            }
          });

          if (isError) {
            this.alertService.error('มีจำนวนที่มียอดจ่ายมากกว่ายอดคงเหลือ หรือ ไม่ได้ระบุจำนวนจ่าย');
            this.modalLoading.hide();
          } else {
            this.issueService.saveIssue(summary, this.products)
              .then((results: any) => {
                if (results.ok) {
                  this.alertService.success();
                  this.router.navigate(['/admin/issues']);
                } else {
                  this.alertService.error(results.error);
                }
                this.modalLoading.hide();
              })
              .catch((error: any) => {
                this.modalLoading.hide();
                this.alertService.error(error.message);
              });
          }

        }).catch(() => {
          this.modalLoading.hide();
        });
    }
  }

  openModal() {
    this.isOpenModal = true;
    this.getIssues();
  }

  async getIssues() {
    try {
      const res = await this.issueService._getIssues(this.warehouseId)
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
      const res = await this.issueService.getGenericList(id)
      if (res.ok) {
        this.objProduct = res.rows;
        for (const v of this.objProduct) {
          const obj: any = {};
          obj.issue_qty = 0;
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

  async doUpload() {
    this.isImport = true;
    try {
      this.modalLoading.show();
      const rs: any = await this.uploadingService.uploadIssueTransaction(this.file[0]);
      this.modalLoading.hide();
      // clear products
      this.products = [];

      if (rs.ok) {
        const data = [];
        rs.rows.forEach(v => {
          if (v.issue_qty > 0) {
            const obj: any = {};
            obj.issue_qty = v.issue_qty;
            obj.generic_id = v.generic_id;
            obj.generic_name = v.generic_name;
            obj.remain_qty = +v.remain_qty;
            obj.conversion_qty = 1;
            obj.unit_generic_id = null;
            obj.warehouse_id = this.warehouseId;
            obj.unit_name = v.unit_name;
            obj.items = [];
            this.products.push(obj);

            data.push({
              genericId: v.generic_id,
              genericQty: v.issue_qty
            });
          }
        });

        this.getAllowcateData(data);

        this.openUpload = false;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getAllowcateData(data) {
    this.modalLoading.show();
    const result: any = await this.issueService.getIssuesProduct(data);
    if (result.ok) {
      const list = result.rows;
      this.products.forEach((v, i) => {
        const idx = _.findIndex(list, { generic_id: v.generic_id });
        if (idx > -1) {
          this.products[i].items.push(list[idx]);
        }
      });
      this.modalLoading.hide();
    } else {
      this.modalLoading.hide();
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
      this.products[idx].issue_qty = qty;
    }
  }
}

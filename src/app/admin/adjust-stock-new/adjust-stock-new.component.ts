import { AdjustStockService } from './../adjust-stock.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
@Component({
  selector: 'wm-adjust-stock-new',
  templateUrl: './adjust-stock-new.component.html',
  styles: []
})
export class AdjustStockNewComponent implements OnInit {

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  adjustDate: any;
  genericId: any;
  genericName: any;
  genericCode: any;
  oldQty: any;
  smallUnit: any;

  qty: any;
  generics: any = [];
  warehouseId: any;
  jwtHelper: JwtHelper = new JwtHelper();
  decodedToken: any;
  reason: any;
  password: any;
  passwordModal = false;
  checkEnterPass = true;
  isSave = false;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('productSearch') public productSearch: any;
  constructor(
    private productService: ProductsService,
    private alertService: AlertService,
    private adjustStockService: AdjustStockService,
    private router: Router
  ) {
    const token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  ngOnInit() {
    this.warehouseId = this.decodedToken.warehouseId;
    const date = new Date();

    this.adjustDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  setSelectedGeneric(e) {
    this.oldQty = e.qty;
    this.genericName = e.generic_name;
    this.genericId = e.generic_id;
    this.genericCode = e.working_code;
    this.smallUnit = e.primary_unit_name;
  }
  editChangeQty() {

  }

  removeGeneric(genericId) {
    const idx = _.findIndex(this.generics, { 'generic_id': genericId })
    if (idx > -1) {
      this.generics.splice(idx, 1);
    }
  }

  enterAddGeneric(e) {
    if (e.keyCode === 13 && this.genericId && this.qty) {
      this.addGeneric();
    }
  }

  enterSave(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.save();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }

  async addGeneric() {
    const obj = {
      generic_id: this.genericId,
      generic_name: this.genericName,
      generic_code: this.genericCode,
      small_unit_name: this.smallUnit,
      qty: this.qty,
      old_qty: this.oldQty,
      products: []
    }
    this.generics.push(obj);
    await this.getProducts(this.genericId);
    this.clearForm();
  }

  async getProducts(genericId) {
    this.modalLoading.show();
    try {
      const rs: any = await this.productService.productInWarehouse(genericId);
      if (rs.ok) {
        const idx = _.findIndex(this.generics, { 'generic_id': genericId })
        if (idx > -1) {
          this.generics[idx].products = rs.rows;
          await this.selectAdjust(this.genericId, this.qty);
        }
        this.modalLoading.hide();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(error));
    }

  }

  clearForm() {
    this.genericId = null;
    this.genericName = null;
    this.smallUnit = '';
    this.qty = '';
    this.oldQty = '';
    this.productSearch.clearProductSearch();
  }

  // เดิมเกลี่ยยอดใหม่ให้ทุก lot เท่าๆ กัน ถ้าผู้ใช้ไม่แก้ราย lot จำนวนจะย้ายข้าม lot (มูลค่าเปลี่ยนตามราคาแต่ละ lot)
  // ตอนนี้: lot เดียว → ใส่ยอดที่กรอกให้ lot นั้น / หลาย lot → คงยอดปัจจุบันไว้ ให้ผู้ใช้กรอกราย lot เอง
  selectAdjust(genericId, qty) {
    const idx = _.findIndex(this.generics, { 'generic_id': genericId });
    if (idx === -1) {
      return;
    }
    const products = this.generics[idx].products;
    for (const p of products) {
      p.old_qty = p.qty;
    }
    if (products.length === 1) {
      products[0].qty = +qty;
      this.generics[idx].qty = +qty;
    } else {
      this.generics[idx].qty = _.sumBy(products, (p: any) => +p.qty);
      if (products.length > 1) {
        this.alertService.error('รายการนี้มีหลาย lot กรุณาระบุจำนวนคงเหลือจริงของแต่ละ lot ในตาราง');
      }
    }
  }

  editChangeAdjust(genericId, qty) {
    const idx = _.findIndex(this.generics, { 'generic_id': genericId });
    if (idx === -1) {
      return;
    }
    const products = this.generics[idx].products;
    if (products.length === 1) {
      products[0].qty = +qty.value;
      this.generics[idx].qty = +qty.value;
    } else {
      // หลาย lot: ไม่เกลี่ยให้ ยอดรวมคำนวณจากราย lot เท่านั้น
      this.generics[idx].qty = _.sumBy(products, (p: any) => +p.qty);
      qty.value = this.generics[idx].qty;
    }
  }

  changeQtyGrid(e) {
    let total_base = 0;
    e.forEach(v => {
      total_base += (+v.qty);
    });
    const idx = _.findIndex(this.generics, { 'generic_id': e[0].generic_id });
    if (idx > -1) {
      this.generics[idx].qty = total_base;
    }
  }

  async save() {
    // const date = this.adjustDate ? this.adjustDate.date.year + '-' + this.adjustDate.date.month + '-' + this.adjustDate.date.day : null;
    try {
      this.isSave = true;
      this.modalLoading.show();
      if (this.password) {
        const rs = await this.adjustStockService.checkPassword(this.password);
        if (rs.ok) {
          if (this.generics.length && this.reason) {
            const head = {
              reason: this.reason
            }
            // เดิมไม่ดูผล เปลี่ยนหน้าเลย → backend ปฏิเสธ (เช่นรายการไม่ใช่ของคลังนี้) ผู้ใช้ไม่เห็น error
            const rsSave: any = await this.adjustStockService.save(head, this.generics);
            if (rsSave && rsSave.ok) {
              this.router.navigate(['/admin/adjust-stock']);
            } else {
              this.isSave = false;
              this.modalLoading.hide();
              this.passwordModal = false;
              this.alertService.error(rsSave && rsSave.error ? rsSave.error : 'บันทึกไม่สำเร็จ');
            }
          } else {
            this.isSave = false;
            this.modalLoading.hide();
            this.alertService.error('ข้อมูลไม่สมบูรณ์');
          }
        } else {
          this.isSave = false;
          this.modalLoading.hide();
          this.passwordModal = false;
          this.alertService.error('รหัสผ่านผิดพลาด');
        }
      } else {
        this.isSave = false;
        this.modalLoading.hide();
        this.alertService.error('ข้อมูลไม่สมบูรณ์');
      }

    } catch (error) {
      this.isSave = false;
      this.modalLoading.hide();
      this.alertService.error(error);
    }


  }
}

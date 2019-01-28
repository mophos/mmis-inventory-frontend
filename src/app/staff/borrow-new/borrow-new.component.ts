import { Router } from '@angular/router';
import { BorrowItemsService } from '../borrow-items.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PeriodService } from './../../period.service';
import { JwtHelper } from 'angular2-jwt';
import { BasicService } from './../../basic.service';
import * as _ from 'lodash';
import { SearchGenericAutocompleteComponent } from '../../directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-borrow-new',
  templateUrl: './borrow-new.component.html',
  styleUrls: []
})
export class BorrowNewComponent implements OnInit {
  lots = [];
  generics = [];
  loading = false;
  locations: any = [];
  locationId: any;

  srcWarehouseId: string;
  dstWarehouseId: string;
  borrowDate: any;

  // selectedProductId: any;
  selectedProduct: any;
  selectedLot: any;
  selectedUnit: any;
  // selectedLotId: any;
  expiredDate: any;
  remainQty = 0;
  conversionQty = 0;
  borrowQty = 0;
  wmProductId: any;
  workingCode: any;
  isSaving = false;
  warehouses: any;
  peopleId: any;
  remark: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  // @ViewChild('lotList') public lotList;
  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;
  @ViewChild('locationList') locationList;
  @ViewChild('modalLoading') private modalLoading;
  @ViewChild('elSearchGeneric') elSearchGeneric: SearchGenericAutocompleteComponent;

  jwtHelper: JwtHelper = new JwtHelper();
  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericName: any;
  genericId: any;
  unitGenericId: any;
  lotNo: any;
  token: any;
  decodedToken: any;

  isSave = false;

  constructor(
    private alertService: AlertService,
    private basicService: BasicService,
    private borrowItemsService: BorrowItemsService,
    private router: Router,
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.dstWarehouseId = this.decodedToken.warehouseId;

    const date = new Date();
    this.borrowDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
    this.getWarehouses();
  }

  changeUnit(event: any) {
    try {
      this.conversionQty = event.qty ? event.qty : 0;
      this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
    } catch (error) {
      //
    }
  }

  setSelectedGeneric(event: any) {
    try {
      if (this.srcWarehouseId) {
        this.productId = event ? event.product_id : null;
        this.productName = event ? event.product_name : null;
        this.genericName = event ? event.generic_name : null;
        this.genericId = event ? event.generic_id : null;
        this.workingCode = event ? event.working_code : null;
        this.remainQty = event ? event.qty - event.reserve_qty : 0;
        this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
        this.primaryUnitId = event ? event.primary_unit_id : null;
        this.primaryUnitName = event ? event.primary_unit_name : null;
        // this.wmProductId = event ? event.wm_product_id : null;
        this.unitList.setGenericId(this.genericId);
        // this.getLots();
      } else {
        this.alertService.error('กรุณาเลือกคลังสินค้าต้นทาง และ ปลายทาง');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  onChangeSearchGeneric(event: any) {
    if (event) {
      this.clearForm();
    }
  }

  setSrcWarehouse(event) {
    if (this.generics.length) {
      this.alertService.confirm('ต้องการยกเลิกรายการที่เลือกไว้แล้ว ใช่หรือไม่?')
        .then(() => {
          this.srcWarehouseId = event.warehouse_id;
          this.generics = [];
        }).catch(() => { });
    } else {
      this.srcWarehouseId = event.warehouse_id;
    }
  }

  async getWarehouses() {
    const rs = await this.basicService.getWarehouses();
    if (rs.ok) {
      this.warehouses = rs.rows;
    } else {
      this.alertService.error(rs.error);
    }
  }

  async setDstWarehouse(event: any) {
    this.dstWarehouseId = event.warehouse_id;
    this.locations = [];
    this.locationId = null;
    this.locationList.getLocations(this.dstWarehouseId);
  }

  async addGeneric() {
    // if (this.borrowQty) {
    const idx = _.findIndex(this.generics, { generic_id: this.genericId });

    if (idx === -1) {
      if (this.genericId) {
        const obj = {
          working_code: this.workingCode,
          generic_name: this.genericName,
          generic_id: this.genericId,
          borrow_qty: +this.borrowQty * this.conversionQty,
          remain_qty: +this.remainQty,
          unit_generic_id: this.unitGenericId,
          conversion_qty: this.conversionQty,
          primary_unit_id: this.primaryUnitId,
          primary_unit_name: this.primaryUnitName
        };

        this.generics.push(obj);
        console.log(this.generics)
        this.clearForm();
      } else {
        this.alertService.error('ข้อมูลไม่ครบถ้วน')
      }

    } else {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม');
    }
  }

  clearForm() {
    this.workingCode = null;
    this.productName = null;
    this.genericName = null;
    this.genericId = null;
    this.unitGenericId = null;
    this.wmProductId = null;
    this.productId = null;
    this.selectedProduct = {};
    this.selectedLot = {};
    this.selectedUnit = {};
    this.remainQty = 0;
    this.borrowQty = 0;
    this.expiredDate = null;
    this.elSearchGeneric.clearSearch();
    this.lotNo = null;
    this.locationId = null;
    this.remark = null;
    this.lots = [];
    this.unitList.clearUnits();
  }

  onChangeEditQty(qty: any) {
    this.borrowQty = qty;
  }

  editChangeUnit(idx: any, event: any) {
    this.generics[idx].unit_generic_id = event.unit_generic_id;
    this.generics[idx].conversion_qty = event.qty;
    // const genericId = this.generics[idx].generic_id;
    const borrowQty = this.generics[idx].borrow_qty * this.generics[idx].conversion_qty;
    this.generics[idx].borrow_qty = borrowQty;
    // this.getProductList(genericId, borrowQty);
  }

  removeProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.generics.splice(idx, 1);
      }).catch(() => { });
  }

  async saveBorrow() {
    this.isSave = true;
    if (this.generics.length && this.srcWarehouseId && this.dstWarehouseId && this.borrowDate) {
      const borrowDate = `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}`;

      const generics = [];
      let isError = false;

      let data = [];
      for (const v of this.generics) {
        if (v.generic_id && v.borrow_qty) {
          console.log(v)
          const _data = {
            genericId: v.generic_id,
            genericQty: v.borrow_qty
          }

          data.push(_data);

          let allocate = await this.borrowItemsService.allocateBorrow(data, this.srcWarehouseId);

          let wmRows = [];
          wmRows.push(allocate.rows);
          
          generics.push({
            generic_id: v.generic_id,
            borrow_qty: +v.borrow_qty,
            unit_generic_id: v.unit_generic_id,
            primary_unit_id: v.primary_unit_id,
            products: {
              data: wmRows
            }
          });
        } else {
          isError = false;
        }
      }

      if (isError) {
        this.alertService.error('ข้อมูลไม่ครบถ้วนหรือไม่สมบูรณ์ เช่น จำนวนยืม');
      } else {

        const summary = {
          borrowDate: `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}`,
          srcWarehouseId: this.srcWarehouseId,
          dstWarehouseId: this.dstWarehouseId,
          peopleId: this.peopleId,
          remark: this.remark
        };

        if (generics.length) {
          this.alertService.confirm('ต้องการยืมรายการสินค้า ใช่หรือไม่?')
            .then(async () => {
              this.modalLoading.show();
              try {
                const rsT: any = await this.borrowItemsService.saveBorrow(summary, generics);
                if (rsT.ok) {
                  this.alertService.success();
                  this.router.navigate(['/staff/borrow']);
                } else {
                  this.alertService.error(JSON.stringify(rsT.error));
                }
                this.modalLoading.hide();
              } catch (error) {
                this.modalLoading.hide();
              }
            })
            .catch(() => {
              this.modalLoading.hide();
            });
        } else {
          this.alertService.error('ไม่พบรายการที่ต้องการยืม');
        }
      }

    }
    // }
    this.isSave = false;
  }

  onChangePeople(event: any) {
    if (event) {
      this.peopleId = null;
    }
  }
  onSelectedPeople(event: any) {
    this.peopleId = event ? event.people_id : null;
  }
}

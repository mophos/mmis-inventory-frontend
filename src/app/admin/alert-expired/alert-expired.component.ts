import { JwtHelper } from 'angular2-jwt';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { AlertExpiredService } from '../alert-expired.service';
import { AlertService } from '../../alert.service';
import { ProductsService } from './../products.service';
import * as _ from 'lodash';
import { BasicService } from '../../basic.service';
@Component({
  selector: 'wm-alert-expired',
  templateUrl: './alert-expired.component.html'
})
export class AlertExpiredComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;

  allGenerics: Array<any> = [];
  selectedGenerics: Array<any> = [];
  selectedGenericIds: Array<any> = [];
  warehouses: any = [];
  warehouseId: any;
  numDays = 10;
  isAll = true;
  isAlert = false;
  openSetSingleExpire = false;
  openSetAllExpired = false;
  submitLoading = false;
  products = [];
  jwtHelper: JwtHelper = new JwtHelper();
  rights: any;
  menuSettingAlertExpired
  token: any;

  query: any = '';
  genericTypeMultis: any;
  @ViewChild('genericTypeMulti') public genericTypeMulti: any;
  constructor(
    private alertExpiredService: AlertExpiredService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private productService: ProductsService,
    private basicService: BasicService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
    this.menuSettingAlertExpired = _.indexOf(this.rights, 'WM_SETTING_ALERT_EXPIRED') === -1 ? false : true;
  }

  async ngOnInit() {
    await this.getAllProducts();
    await this.getWarehouses();
    await this.getProductExpired();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.genericTypeMultis = this.genericTypeMulti.getDefaultGenericType();
  }

  async getProductExpired() {
    this.modalLoading.show();
    try {
      let _w: any = [];
      if (this.warehouseId === 'all') {
        for (const w of this.warehouses) {
          _w.push(w.warehouse_id);
        }
      } else {
        _w = [this.warehouseId];
      }
      const rs: any = await this.alertExpiredService.getProductExpired(this.genericTypeMultis, _w, this.query);
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }


  async getAllProducts() {
    this.isAll = true;
    this.modalLoading.show();
    try {
      const rs: any = await this.alertExpiredService.getAllGenerics(this.genericTypeMultis, this.query);
      if (rs.ok) {
        this.allGenerics = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  selectGenericTypeMulti(e) {
    this.genericTypeMultis = e;
    this.getProductExpired();
  }
  selectGenericTypeMultiSetting(e) {
    this.genericTypeMultis = e;
    if (this.isAll) {
      this.getAllProducts();
    } else {
      this.getUnsetProducts()
    }
  }


  setExpireCount() {
    try {
      // clear old data
      this.selectedGenericIds = [];
      this.selectedGenerics.forEach((v: any) => {
        this.selectedGenericIds.push(v.generic_id);
      });
      this.openSetSingleExpire = true;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  setExpireCountAll() {
    this.openSetAllExpired = true;
  }

  setSingleExpire(product: any) {
    // clear old data
    this.selectedGenericIds = [];
    this.selectedGenericIds.push(product.generic_id);
    this.openSetSingleExpire = true;
  }

  async saveExpireCount() {
    try {
      if (this.numDays > 0) {
        this.submitLoading = true;
        const rs: any = await this.alertExpiredService.saveExpiredCount(this.selectedGenericIds, this.numDays);
        if (rs.ok) {
          this.openSetSingleExpire = false;
          await this.getAllProducts();
          await this.getProductExpired();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
        }
        this.submitLoading = false;
      } else {
        this.submitLoading = false;
        this.alertService.error('ควรกำหนดวันที่แจ้งเตือนอย่างน้อย 10 วันขึ้นไป');
      }
    } catch (error) {
      this.submitLoading = false;
      this.alertService.serverError();
    }
  }

  async saveExpireCountAll() {
    try {
      if (this.numDays > 0) {
        this.submitLoading = true;
        const rs: any = await this.alertExpiredService.saveExpiredCountAll(this.genericTypeMultis, this.numDays);
        if (rs.ok) {
          this.openSetAllExpired = false;
          await this.getAllProducts();
          await this.getProductExpired();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
        }
        this.submitLoading = false;
      } else {
        this.submitLoading = false;
        this.alertService.error('ควรกำหนดวันที่แจ้งเตือนอย่างน้อย 10 วันขึ้นไป');
      }
    } catch (error) {
      this.submitLoading = false;
      this.alertService.serverError();
    }

  }

  getUnsetProducts() {
    this.isAll = false;
    this.modalLoading.show();
    this.alertExpiredService.getUnsetProducts(this.genericTypeMultis, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.allGenerics = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
        this.ref.detectChanges();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  async getWarehouses() {
    const rs = await this.basicService.getWarehouses();
    if (rs.ok) {
      this.warehouses = rs.rows;
      this.warehouseId = 'all';
    } else {
      this.alertService.error(rs.error);
    }
  }

  changeWarehouses() {
    this.getProductExpired();
  }

  report() {
    let genericTypeLV1: any;
    let genericTypeLV2: any;
    let genericTypeLV3: any;
    if (this.genericTypeMultis.generic_type_lv1_id.length) {
      genericTypeLV1 = this.genericTypeMultis.generic_type_lv1_id.join(',')
    }
    if (this.genericTypeMultis.generic_type_lv2_id.length) {
      genericTypeLV2 = this.genericTypeMultis.generic_type_lv2_id.join(',')
    }
    if (this.genericTypeMultis.generic_type_lv3_id.length) {
      genericTypeLV3 = this.genericTypeMultis.generic_type_lv3_id.join(',')
    }

    let _w: any = [];
    if (this.warehouseId === 'all') {
      for (const w of this.warehouses) {
        _w.push(w.warehouse_id);
      }
    } else {
      _w = [this.warehouseId];
    }
    const url = `${this.apiUrl}/report/print/alert-expried?genericTypeLV1Id=${genericTypeLV1}&genericTypeLV2Id=${genericTypeLV2}&genericTypeLV3Id=${genericTypeLV3}&warehouseId=${_w}&token=${this.token}`;
    this.htmlPreview.showReport(url, 'landscape');
  }

  reportExcel() {
    let genericTypeLV1: any;
    let genericTypeLV2: any;
    let genericTypeLV3: any;
    if (this.genericTypeMultis.generic_type_lv1_id.length) {
      genericTypeLV1 = this.genericTypeMultis.generic_type_lv1_id.join(',')
    }
    if (this.genericTypeMultis.generic_type_lv2_id.length) {
      genericTypeLV2 = this.genericTypeMultis.generic_type_lv2_id.join(',')
    }
    if (this.genericTypeMultis.generic_type_lv3_id.length) {
      genericTypeLV3 = this.genericTypeMultis.generic_type_lv3_id.join(',')
    }
    let _w: any = [];
    if (this.warehouseId === 'all') {
      for (const w of this.warehouses) {
        _w.push(w.warehouse_id);
      }
    } else {
      _w = [this.warehouseId];
    }
    const url = `${this.apiUrl}/report/print/alert-expried/excel?genericTypeLV1Id=${genericTypeLV1}&genericTypeLV2Id=${genericTypeLV2}&genericTypeLV3Id=${genericTypeLV3}&warehouseId=${_w}&token=${this.token}`;
    window.open(url, '_blank');
  }

  search(event: any) {
    if (this.isAll) {
      this.getAllProducts();
    } else {
      this.getUnsetProducts()
    }
  }
}

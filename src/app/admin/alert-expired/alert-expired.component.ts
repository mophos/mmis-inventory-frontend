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
  genericTypes = [];
  genericType: any = "all";
  genericTypeE: any = "all";
  products = [];
  jwtHelper: JwtHelper = new JwtHelper();
  rights: any;
  menuSettingAlertExpired
  token: any;

  query:any ='';
  constructor(
    private alertExpiredService: AlertExpiredService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private productService: ProductsService,
    private basicService: BasicService,
    @Inject('API_URL') private apiUrl: string
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
    this.menuSettingAlertExpired = _.indexOf(this.rights, 'WM_SETTING_ALERT_EXPIRED') === -1 ? false : true;
  }

  async ngOnInit() {
    await this.getGenericType();
    await this.getAllProducts();
    // this.getStatus();
    await this.getWarehouses();
    await this.getProductExpired();
  }

  // getStatus() {
  //   this.modalLoading.show();
  //   this.alertExpiredService.getStatus()
  //     .then((result: any) => {
  //       if (result.ok) {
  //         if (result.status === 'Y') {
  //           this.isAlert = true;
  //         } else {
  //           this.isAlert = false;
  //         }
  //       } else {
  //         this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
  //       }
  //       this.modalLoading.hide();
  //     })
  //     .catch(() => {
  //       this.modalLoading.hide();
  //       this.alertService.serverError();
  //     });
  // }

  async getProductExpired() {
    this.modalLoading.show();
    try {
      let _genericType;
      let _warehouseId;
      if (this.genericTypeE === 'all') {
        const _g = [];
        this.genericTypes.forEach(v => {
          _g.push(v.generic_type_id)
        });
        _genericType = _g;
      } else {
        _genericType = this.genericTypeE;
      }
      if (this.warehouseId === 'all') {
        const _w = [];
        this.warehouses.forEach(v => {
          _w.push(v.warehouse_id)
        });
        _warehouseId = _w;
      } else {
        _warehouseId = this.warehouseId;
      }
      const rs: any = await this.alertExpiredService.getProductExpired(_genericType, _warehouseId);
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
      const rs: any = await this.alertExpiredService.getAllGenerics(this.query);
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

  async changeGenericType() {
    this.isAll = true;
    this.modalLoading.show();
    if (this.genericType === 'all') {
      this.getAllProducts()
    } else {
      try {
        const rs: any = await this.alertExpiredService.getSelectGenerics(this.genericType);
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

  }

  async changeGenericTypeE() {
    this.getProductExpired();
  }

  async getGenericType() {
    try {
      this.modalLoading.show();
      const rs = await this.productService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
        this.genericType = 'all';
        this.genericTypeE = 'all';
      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error);
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

  saveExpireCount() {
    if (this.numDays > 0) {
      this.submitLoading = true;
      this.alertExpiredService.saveExpiredCount(this.selectedGenericIds, this.numDays)
        .then((result: any) => {
          if (result.ok) {
            this.openSetSingleExpire = false;
            this.getAllProducts();
          } else {
            this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
          }
          this.submitLoading = false;
        })
        .catch(() => {
          this.submitLoading = false;
          this.alertService.serverError();
        });
    } else {
      this.submitLoading = false;
      this.alertService.error('ควรกำหนดวันที่แจ้งเตือนอย่างน้อย 10 วันขึ้นไป');
    }
  }

  saveExpireCountAll() {
    if (this.numDays > 0) {
      this.submitLoading = true;
      this.alertExpiredService.saveExpiredCountAll(this.selectedGenericIds, this.numDays)
        .then((result: any) => {
          if (result.ok) {
            this.openSetAllExpired = false;
            this.getAllProducts();
          } else {
            this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
          }
          this.submitLoading = false;
        })
        .catch(() => {
          this.submitLoading = false;
          this.alertService.serverError();
        });
    } else {
      this.submitLoading = false;
      this.alertService.error('ควรกำหนดวันที่แจ้งเตือนอย่างน้อย 10 วันขึ้นไป');
    }
  }

  getUnsetProducts() {
    this.isAll = false;
    this.modalLoading.show();
    this.alertExpiredService.getUnsetProducts()
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
    let _genericType
    let _warehouseId
    if (this.genericTypeE === 'all') {
      const _g = [];
      this.genericTypes.forEach(v => {
        _g.push(v.generic_type_id)
      });
      _genericType = _g;
    } else {
      _genericType = this.genericTypeE;
    }
    if (this.warehouseId === 'all') {
      const _w = [];
      this.warehouses.forEach(v => {
        _w.push(v.warehouse_id)
      });
      _warehouseId = _w;
    } else {
      _warehouseId = this.warehouseId;
    }
    const url = `${this.apiUrl}/report/print/alert-expried?token=${this.token}&genericTypeId=${_genericType}&warehouseId=${_warehouseId}`;
    this.htmlPreview.showReport(url, 'landscape');
  }

  searc(event: any) {
    this.getAllProducts();
  }
}

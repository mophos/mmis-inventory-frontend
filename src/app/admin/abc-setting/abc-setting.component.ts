import { Component, OnInit, ViewChild } from '@angular/core';

import { AbcVenService } from '../abc-ven.service';
import { AlertService } from '../../alert.service';

import * as _ from 'lodash';

@Component({
  selector: 'wm-abc-setting',
  templateUrl: './abc-setting.component.html',
  styleUrls: ['./abc-setting.component.css']
})
export class AbcSettingComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading;

  isActive = false;
  abcList: Array<any> = [];
  strType = 'ABC';
  abcSorting: any;

  constructor(
    private abcVenService: AbcVenService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getAbcList();
    this.getSettingStatus();
    this.getSettingSorting();
  }

  getAbcList() {
    this.modalLoading.show();
    this.abcVenService.getAbcList()
      .then((result: any) => {
        if (result.ok) {
          this.abcList = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(error => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  getSettingStatus() {
    this.modalLoading.show();
    this.abcVenService.getSettingStatus(this.strType)
      .then((result: any) => {
        if (result.ok) {
          if (result.status === 'Y') {
            this.isActive = true;
          } else {
            this.isActive = false;
          }
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  async getSettingSorting() {
    try {
      this.modalLoading.show();
      const rs: any = await this.abcVenService.getSettingAbcSorting();
      if (rs.ok) {
        this.abcSorting = rs.value;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  setActiveStatus() {
    if (this.isActive) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }

    const status = this.isActive ? 'Y' : 'N';
    this.modalLoading.show();
    this.abcVenService.saveSettingStatus(status, this.strType)
      .then((result: any) => {
        if (result.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }


  changeQty(abcId, qty) {
    const idx = _.findIndex(this.abcList, { abc_id: abcId });
    if (idx > -1) {
      this.abcList[idx].usage_qty = +qty;
    }
  }

  changeMonth(abcId, monthQty) {
    const idx = _.findIndex(this.abcList, { abc_id: abcId });
    if (idx > -1) {
      this.abcList[idx].cycle_month = +monthQty;
    }
  }

  saveAbc() {
    let isValid = true;
    let total = 0;
    this.abcList.forEach((v: any) => {
      total += +v.usage_qty;
      if (v.usage_qty <= 0 || v.cycle_month <= 0) {
        isValid = false;
      }
    });

    if (isValid) {
      if (total === 100) {
        this.modalLoading.show();
        this.abcVenService.saveAbc(this.abcList, this.abcSorting)
          .then((result: any) => {
            if (result.ok) {
              this.alertService.success();
            } else {
              this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
            }
            this.modalLoading.hide();
          })
          .catch(error => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      } else {
        this.alertService.error('เปอร์เซ็นต์รวม ต้องเท่ากับ 100%');
      }
    } else {
      this.alertService.error('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ');
    }
  }
}

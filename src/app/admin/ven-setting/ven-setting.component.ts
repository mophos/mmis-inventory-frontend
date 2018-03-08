import { Component, OnInit, ViewChild } from '@angular/core';
import { AbcVenService } from '../abc-ven.service';
import { AlertService } from '../../alert.service';

import * as _ from 'lodash';

@Component({
  selector: 'wm-ven-setting',
  templateUrl: './ven-setting.component.html',
  styleUrls: ['./ven-setting.component.css']
})
export class VenSettingComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;

  isActive = false;
  venList: Array<any> = [];

  strType = 'VEN';

  constructor(
    private abcVenService: AbcVenService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getvenList();
    this.getSettingStatus();
  }

  getvenList() {
    this.modalLoading.show();
    this.abcVenService.getVenList()
      .then((result: any) => {
        if (result.ok) {
          this.venList = result.rows;
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

  changeQty(venId, qty) {
    const idx = _.findIndex(this.venList, { ven_id: venId });
    if (idx > -1) {
      this.venList[idx].cycle_month = +qty;
    }
  }

  saveVen() {
    try {
      let isValid = true;
      this.venList.forEach((v: any) => {
        if (v.cycle_month <= 0) {
          isValid = false;
        }
      });

      if (isValid) {
        this.modalLoading.show();
        this.abcVenService.saveVen(this.venList)
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
        this.alertService.error('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ');
      }
    } catch (error) {
      this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(error.message));
    }
  }

}

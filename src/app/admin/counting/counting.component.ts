import { CountingService } from './../counting.service';
import { ProductsService } from './../products.service';
import { AlertService } from '../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'wm-counting',
  templateUrl: './counting.component.html',
  styleUrls: ['./counting.component.css']
})
export class CountingComponent implements OnInit {
  products: any = [];
  selectedProduct = [];
  countDate: any;
  modalPrint = false;
  isPreview = false;
  options: any;

  modalSetCounting = false;
  maskTime = [/\d/, /\d/, ':', /\d/, /\d/];
  eventTime: any;
  eventStatus = false;
  cycleLogs: any = [];

  items: any = [];

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  @ViewChild('viewer') viewer: any;
  @ViewChild('modalLoading') public modalLoading;

  constructor(
    private alertService: AlertService,
    private countingService: CountingService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }

  ngOnInit() {
    this.getList();
    this.getCycleCountingStatus();
    this.getCycleLogs();
  }

  async getList() {
    try {
      this.items = [];
      this.modalLoading.show();
      const resp = await this.countingService.list();
      if (resp.ok) {
        this.items = resp.rows;
        this.ref.detectChanges();
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  doPrintCountingWithOutRemain(countId: any) {
    this.isPreview = true;
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/counting/pdf/counting-without-remain/${countId}?token=${token}`;
    window.open(url, '_blank');
  }

  doPrintCountingWithRemain(countId: any) {
    this.isPreview = true;
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/counting/pdf/counting-remain/${countId}?token=${token}`;
    window.open(url, '_blank');
  }

  removeCounting(countId: any) {
    this.alertService.confirm(`ต้องการลบรายการนับรหัส ${countId} นี้ ใช่หรือไม่?`)
      .then(() => {
        this.countingService.removeCounting(countId)
          .then((result: any) => {
            if (result.ok) {
              this.alertService.success();
              this.getList();
            } else {
              this.alertService.error(JSON.stringify(result.error));
            }
          })
          .catch((error: any) => {
            console.log(error.message);
            this.alertService.serverError();
          })
      })
      .catch(() => { });
  }

  confirmCounting(i: any) {

  }

  printCheck(i: any) {

  }

  // cycle counting
  async setCycleCounting() {
    const resp = await this.countingService.getEventTime();
    if (resp.ok) {
      this.eventTime = resp.eventTime;
      this.modalSetCounting = true;
    } else {
      this.alertService.error(JSON.stringify(resp.error));
    }
  }

  async saveCycleCounting() {
    const isValidTime = moment(this.eventTime, 'HH:mm').isValid();
    if (isValidTime) {
      const resp = await this.countingService.saveEventTime(this.eventTime);
      if (resp.ok) {
        this.alertService.success();
        this.modalSetCounting = false;
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
    } else {
      this.alertService.error('ข้อมูลเวลา ไม่ถูกรูปแบบ กรุณาตรวจสอบ');
    }
  }

  async getCycleCountingStatus() {
    const resp = await this.countingService.getEventStatus();
    if (resp.ok) {
      this.eventStatus = resp.eventStatus === 'Y' ? true : false;
    } else {
      this.alertService.error(JSON.stringify(resp.error));
    }
  }

  async startCycleCounting() {
    this.eventStatus = true;
    const eventStatus = 'Y';
    const resp = await this.countingService.saveEventStatus(eventStatus);
    if (resp.ok) {
      this.alertService.success();
    } else {
      this.alertService.error(JSON.stringify(resp.error));
    }
  }

  async stopCycleCounting() {
    this.eventStatus = false;
    const eventStatus = 'N';
    const resp = await this.countingService.saveEventStatus(eventStatus);
    if (resp.ok) {
      this.alertService.success();
    } else {
      this.alertService.error(JSON.stringify(resp.error));
    }
  }

  startNewCycleCounting() {
    this.alertService.confirm('คุณต้องการเริ่มการนับ Cycle ใหม่หรือไม่? \n (เริ่มนับใหม่ทั้งหมด)')
      .then(() => {
        this.countingService.startNewCycleCounting()
          .then((resp: any) => {
            if (resp.ok) {
              this.alertService.success();
            } else {
              this.alertService.error(JSON.stringify(resp.error));
            }
          })
          .catch((error: any) => {
            this.alertService.serverError();
          });
      })
      .catch(() => { });
  }

  async getCycleLogs() {
    this.modalLoading.show();
    this.cycleLogs = [];
    try {
      const resp = await this.countingService.getCycleLogs();
      if (resp.ok) {
        this.cycleLogs = resp.rows;
        this.ref.detectChanges();
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.alertService.serverError();
      this.modalLoading.hide();
    }
  }

}

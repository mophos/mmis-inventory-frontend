import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ReceiveService } from '../../admin/receive.service';
import { AlertService } from '../../alert.service';

import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-modal-receive-approve',
  templateUrl: './modal-receive-approve.component.html',
  styles: []
})
export class ModalReceiveApproveComponent implements OnInit {

  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  // @Input() public receiveId: any;

  open = false;
  approveDate: any;
  comment: any;
  receiveIds: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };

  jwtHelper: JwtHelper = new JwtHelper();

  isConfirmApprove = false;

  constructor(private receiveService: ReceiveService, private alertService: AlertService) { }

  ngOnInit() {
    const date = new Date();

    this.approveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    this.isConfirmApprove = decoded.WM_APPROVE_ALERT === 'Y' ? true : false;
  }

  openModal() {
    if (this.isConfirmApprove) {
      this.open = true;
    } else {
      this.saveApprove();
      this.open = false;
    }
  }

  closeModal() {
    this.onClose.emit();
    this.open = false;
  }

  saveSuccess() {
    this.onSuccess.emit();
    this.open = false;
  }

  setReceiveIds(receiveIds: any[]) {
    this.receiveIds = receiveIds;
  }

  saveApprove() {
    const _approveDate = `${this.approveDate.date.year}-${this.approveDate.date.month}-${this.approveDate.date.day}`;
    try {
      if (!this.receiveIds.length) {
        this.alertService.error('กรุณาระบุเลขที่ใบรับ')
      } else {
        this.receiveService.saveApprove(this.receiveIds, _approveDate, this.comment)
          .then((res: any) => {
            if (res.ok) {
              this.alertService.success();
              this.saveSuccess();
            } else {
              this.alertService.error(res.error);
            }
          })
          .catch((error) => {
            this.alertService.error(error.message);
          });
      }
    } catch (error) {
      console.log(error);

      this.alertService.error('เกิดข้อผิดพลาด')
    }

  }
}

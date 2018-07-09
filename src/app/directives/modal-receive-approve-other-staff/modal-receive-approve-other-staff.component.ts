import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertService } from '../../alert.service';
import { ReceiveService } from '../../staff/receive.service'

import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';

@Component({
  selector: 'wm-modal-receive-approve-other-staff',
  templateUrl: './modal-receive-approve-other-staff.component.html',
  styles: []
})
export class ModalReceiveApproveOtherStaffComponent implements OnInit {

  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSuccess') onSuccess: EventEmitter<any> = new EventEmitter<any>();
  
  open = false;
  approveDate: any;
  comment: any;
  receiveOtherIds: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };

  constructor(
    private receiveService: ReceiveService, 
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const date = new Date();

    this.approveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  openModal() {
    this.open = false;
    this.saveApprove();
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
    this.receiveOtherIds = [];
    this.receiveOtherIds = receiveIds;
  }

  saveApprove() {

    const _approveDate = `${this.approveDate.date.year}-${this.approveDate.date.month}-${this.approveDate.date.day}`;
    try {
      if (!this.receiveOtherIds.length) {
        this.alertService.error('กรุณาระบุเลขที่ใบรับ')
      } else {
        this.receiveService.saveApproveOther(this.receiveOtherIds, _approveDate, this.comment)
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

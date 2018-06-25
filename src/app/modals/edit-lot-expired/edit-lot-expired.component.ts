import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertService } from '../../alert.service';
import * as moment from 'moment';

@Component({
  selector: 'wm-edit-lot-expired',
  templateUrl: './edit-lot-expired.component.html',
  styles: []
})
export class EditLotExpiredComponent implements OnInit {
  @Output("save") save = new EventEmitter<number>();
  @Output("past") past = new EventEmitter<number>();

  history: any = [];
  opened = false;
  selectedTab = 'edit';

  product: any = {
    working_code: null,
    product_name: null
  };
  lotNo: any;
  oldLotNo: any;
  expiredDate: any;
  oldExpiredDate: any;
  reason: any;

  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  show(data) {
    this.product = data;
    this.oldLotNo = data.lot_no;
    this.oldExpiredDate = moment(data.expired_date).isValid() ? moment(data.expired_date).format('DD/MM/YYYY') : null;
    this.lotNo = data.lot_no;
    this.expiredDate = moment(data.expired_date).isValid() ? moment(data.expired_date).format('DD/MM/YYYY') : null;
    this.setSelectedTab('edit');
    this.opened = true;
  }

  hide() {
    this.opened = false;
  }

  onSave() {
    if ((this.product.is_lot_control === 'Y' && !this.lotNo) || (this.product.expired_setting === 'Y' && !this.expiredDate) || !this.reason) {
      this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
    } else {
      if ((this.oldLotNo === this.lotNo) && (this.oldExpiredDate === this.expiredDate)) {
        this.alertService.error('ไม่พบการเปลี่ยนแปลง กรุณาตรวจสอบข้อมูล');
      } else {
        this.alertService.confirm('ต้องการบันทึกการเปลี่ยนแปลง ใช่หรือไม่?')
        .then(() => {
          this.product.old_lot_no = this.oldLotNo;
          this.product.new_lot_no = this.lotNo;
          this.product.old_expired_date = this.oldExpiredDate;
          this.product.new_expired_date = this.expiredDate;
          this.product.reason = this.reason;
          this.save.emit(this.product);
        })
        .catch(() => { });
      }
    }
  }

  getHistory() {
    this.past.emit();
  }

  setHistory(data: any[]) {
    this.history = [];
    data.forEach((v) => {
      const _data = {
        history_date: v.history_date,
        history_time: v.history_time,
        old_lot_no: v.old_lot_no,
        old_expired_date: moment(v.old_expired_date).isValid() ? moment(v.old_expired_date).format('DD/MM/YYYY') : null,
        new_lot_no: v.new_lot_no,
        new_expired_date: moment(v.new_expired_date).isValid() ? moment(v.new_expired_date).format('DD/MM/YYYY') : null,
        create_name: v.create_name,
        reason: v.reason
      }
      this.history.push(_data);
    });
    this.setSelectedTab('history');
  }

  setSelectedTab(tab: any) {
    this.selectedTab = tab;
  }

}

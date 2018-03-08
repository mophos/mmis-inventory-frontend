import { UsersService } from './../../users.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LotService } from 'app/admin/lot.service';
import { DateService } from 'app/date.service';
import * as moment from 'moment';

@Component({
  selector: 'wm-add-lots-modal',
  templateUrl: './add-lots-modal.component.html',
  styleUrls: ['./add-lots-modal.component.css']
})
export class AddLotsModalComponent implements OnInit {
  // productId: any;
  @Output("onSuccess") onSuccess = new EventEmitter<boolean>();
  @Input('productId') productId: any;
  @ViewChild('inputLot') private inputLot: any;

  public mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  lots = [];
  lotNo: string;
  lotId: any;
  expiredDate: any;
  isSaving = false;
  isActive = false;
  isUpdate = false;
  loading = false;
  
  open: boolean = false;

  constructor(
    private lotService: LotService,
    private alertService: AlertService,
    private dateService: DateService
  ) { }

  ngOnInit() {
    const expDate = moment().add(3, 'month');
    // this.getLots();
  }

  setProductId(productId: any) {
    this.productId = productId;
    this.getLots();
  }

  getLots() {
    this.lots = [];
    this.loading = true;
    this.lotService.getLots(this.productId)
      .then((result: any) => {
        if (result.ok) {
          this.lots = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error(error.messag);
      });
  }

  editLot(lot) {
    this.isUpdate = true;
    this.lotNo = lot.lot_no;
    this.lotId = lot.lot_id;
    this.isActive = lot.is_active === 'Y' ? true : false;
    const _expDate: any = moment(lot.expired_date).format('YYYY-MM-DD');
    const exp = _expDate.split('-');
    this.expiredDate = lot.expired_date ?
      `${exp[2]}-${exp[1]}-${+exp[0]}` : null;

    this.lots.forEach(v => {
      if (v.lot_id === lot.lot_id) {
        v.is_update = 'Y';
      } else {
        v.is_update = 'N';
      }
    });

    this.inputLot.nativeElement.focus();
  }

  async saveLot() {
    this.isSaving = true;
    if (this.expiredDate) {
      
      if (this.dateService.isValid(this.expiredDate)) {
        const d: any = this.expiredDate.split('-');
        const _strEngDate = `${+d[2]}-${d[1]}-${d[0]}`;
        let resp;
        const _lot = this.lotNo ? this.lotNo : this.randomString(8);
        const _isActive = this.isActive ? 'Y' : 'N';
        try {
          if (this.isUpdate) {
            resp = await this.lotService.update(this.lotId, _lot, _strEngDate, _isActive);
          } else {
            resp = await this.lotService.save(_lot, _strEngDate, this.productId, _isActive);
          }

          if (resp.ok) {
            this.alertService.success();
            this.lotNo = null;
            this.expiredDate = null;
            this.isActive = true;
            this.getLots();
            this.resetForm();
          } else {
            this.alertService.error(JSON.stringify(resp.error));
          }
          this.isSaving = false;
          
        } catch (error) {
          this.alertService.error(error.message);
        }
      } else {
        this.isSaving = false;
        this.alertService.error('รูปแบบวันที่ไม่ถูกต้อง');
      }
    } else {
      this.isSaving = false;
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  resetForm() {
    this.lotNo = null;
    this.expiredDate = null;
    this.isActive = true;
    this.isUpdate = false;
    this.lotId = null;

    this.lots.forEach(v => {
      v.is_update = 'N';
    });
  }

  randomString(length: number) {
    let result = '';
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

  openModal() {
    this.open = true;
  }

  closeModal() {
    this.onSuccess.emit(true);
    this.open = false;
  }

  clearLots() {
    this.lots = [];
  }

}

import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { PickService } from '../pick.service'
import { WarehouseService } from '../warehouse.service';
import * as _ from 'lodash';
import { SearchPeopleAutoCompleteComponent } from '../../directives/search-people-autocomplete/search-people-autocomplete.component';
import * as moment from 'moment';
@Component({
  selector: 'wm-pick-new',
  templateUrl: './pick-new.component.html',
  styleUrls: ['./pick-new.component.css']
})
export class PickNewComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('elSearchPeople') elSearchPeople: SearchPeopleAutoCompleteComponent;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  myDatePickerReceiveOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };

  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  peopleName: any;
  // pickCode: any;
  pickDate: any;

  // receiveCode: any;
  receiveDate: any;

  isOpenModal: any = false;
  pickId: any
  pickQty: any;
  products: any = [];
  receive: any
  wmPick: any;
  warehouses: any;
  genericSearch: any
  peopleId: any;
  remark: any
  pick_code: any;
  decodedToken: any;
  rights: any;
  menuEditAfter: boolean;
  approve: boolean = true;
  constructor(
    private alertService: AlertService,
    @Inject('API_URL') private url: string,
    private pickService: PickService,
    private wareHouseService: WarehouseService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.pickId = this.route.snapshot.params.pickId;
    const token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
    const accessRight = this.decodedToken.accessRight;
    this.rights = accessRight.split(',');
    this.menuEditAfter = _.indexOf(this.rights, 'WM_PICK_EDITAFTER') === -1 ? false : true;
  }

  ngOnInit() {
    this.getWarehouses()
    const date = new Date();
    this.pickDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    if (this.pickId) {
      this.getPick(this.pickId)
    }
  }
  searchReceive() {
    this.isOpenModal = true;
    this.getReceive('')
  }
  async getPick(pickId: any) {
    const rs: any = await this.pickService.getPickEdit(pickId)
    try {
      if (rs.ok) {
        let detail = rs.rows[0] || {}
        this.products = rs.products || []
        console.log(this.products);

        if (detail.pick_date) {
          this.pickDate = {
            date: {
              year: moment(detail.pick_date).get('year'),
              month: moment(detail.pick_date).get('month') + 1,
              day: moment(detail.pick_date).get('date')
            }
          };
        }
        this.approve =  detail ? detail.is_approve == 'Y' ? false : true : true;
        this.peopleId = detail ? detail.people_id : '';
        this.wmPick = detail ? detail.wm_pick : '';
        this.remark = detail ? detail.remark : '';
        const fullname = detail ? detail.fullname : '';
        this.elSearchPeople.setDefault(fullname);
        this.peopleId = detail ? detail.people_id : '';
        this.pick_code = detail ? detail.pick_code : '';
        this.modalLoading.hide()
      } else {
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.alertService.error(error)
    }
    this.modalLoading.hide()
  }
  onChangePeople(event: any) {
    if (event) {
      console.log(event);

      this.peopleId = null;
    }
  }
  onSelectedPeople(event: any) {
    this.peopleId = event ? event.people_id : null;
  }

  async savePick() {
    this.alertService.confirm('คุณต้องการบันทึกการหยิบ ใช่หรือไม่?')
      .then(async () => {
        let is_save = true
        let date = this.pickDate ? `${this.pickDate.date.year}-${this.pickDate.date.month}-${this.pickDate.date.day}` : null;
        for (let _product of this.products) {
          if (( _product.pick_qty == 0 || (_product.receive_qty - _product.remain_qty - _product.pick_qty) < 0)) {
            this.alertService.error('กรุณาตรวจสอบจำนวนหยิบ');
            is_save = false
          }
        }
        if (is_save) {
          this.pickService.savePick(this.pickId, date, this.wmPick, this.products, this.peopleId, this.remark)
            .then((results: any) => {
              if (results.ok) {
                this.alertService.success();
                this.router.navigate(['/admin/pick']);
              } else {
                this.alertService.error(results.error);
              }
              this.modalLoading.hide();
            }).catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.error(error.message);
            });
        }
      })
      .catch(()=>{})


  }



  removeSelectedProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.products.splice(idx, 1);
      })
      .catch((error) => {
        
      });
  }
  async getReceive(query: any) {
    const rs: any = await this.pickService.gerProductReceiveNotPO(query)
    try {
      if (rs.ok) {
        this.receive = rs.rows
        this.modalLoading.hide()
      } else {
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.alertService.error(error)
    }
  }
  async addReceive(item: any) {
    console.log(item);
    const idx = _.findIndex(this.products, { product_id: item.product_id, lot_no: item.lot_no, receive_id: item.receive_id });
    if (idx === -1) {
      item.pick_qty = 0
      this.products.push(item);
      console.log(this.products);
    } else {
      this.alertService.error('มีรายการที่เลือกแล้ว')
    }

    this.isOpenModal = false

  }
  async getWarehouses() {
    this.modalLoading.show();
    try {
      const rs: any = await this.wareHouseService.getWarehouse();
      this.modalLoading.hide();
      console.log(rs);

      if (rs.ok) {
        this.warehouses = _.sortBy(rs.rows, 'short_code');
        // this.wareHouses = _.clone(this.tmpwareHouses);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }
  search(event) {
        this.getReceive(this.genericSearch);
  }
  editChangeReceiveQty(idx: any, cmp: any) {
    let tmp = this.products[idx].receive_qty - this.products[idx].remain_qty
    if(tmp <= 0){
      this.alertService.error('ไม่สามารใช้รายการนี้ได้ ลบออกจากรายการ')
        this.products.splice(idx, 1);
    } else if (cmp.value > tmp) {
      this.alertService.error(`หยิบได้ไม่เกินจำนวนที่รับเข้า`)
      this.products[idx].pick_qty = tmp;
    } else {
      this.products[idx].pick_qty = cmp.value;
    }
  }

}

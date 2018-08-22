import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AlertService } from '../../alert.service';
import { PickService } from '../pick.service'
import * as _ from 'lodash'
@Component({
  selector: 'wm-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.css']
})
export class PickComponent implements OnInit {
  query: any;
  selectedPrint: any = [];
  order: any = [];
  perPage = 10;
  total = 0
  currentPage = 1
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;

  constructor(
    private alertService: AlertService,
    @Inject('API_URL') private url: string,
    private pickService: PickService
  ) { }

  ngOnInit() {
  }

  async refresh(event: any) {
    const offset = +event.page.from;
    const limit = +event.page.size;
    this.getList(limit, offset)
  }

  async getList(limit: number = this.perPage, offset: number = 0) {
    this.modalLoading.show();
    let rs: any = await this.pickService.getList(limit, offset);
    try {
      if (rs.ok) {
        this.order = rs.rows
        this.total = rs.total
        console.log(this.total);
      } else {
        this.alertService.confirm(rs.error)
      }
    } catch (error) {
      this.alertService.error(error)
    }
    this.modalLoading.hide()
  }

  printReport() {

  }
  search() {

  }
  showReport(pick_id: any) {

  }
  async remove(pick_id: any) {
    this.alertService.confirm('ต้องการยกเลิกรายการหยิบ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        let rs: any = await this.pickService.removePick(pick_id);
        try {
          if (rs.ok) {
            this.order[_.findIndex(this.order, { pick_id: pick_id })].is_cancel = 'Y'
            this.alertService.success()
          }
        } catch (error) {
          this.alertService.error(error)
        }
        this.modalLoading.hide()
      })
      .catch(() => { })
  }
  async approve(pick_id:any){
    this.alertService.confirm('ยืนยันการอนุมัติรายการหยิบ ใช่หรือไม่?')
    .then(async ()=>{
     let rs:any =  await this.pickService.approvePick(pick_id)
     if(rs.ok){
      this.order[_.findIndex(this.order, { pick_id: pick_id })].is_approve = 'Y'
       this.alertService.success()
     } else {
      this.alertService.error(rs.error)
     }
    }).catch(()=>{})
  }
}

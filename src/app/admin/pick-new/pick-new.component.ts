import { Component, OnInit, ViewChild, Inject, NgZone } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { AlertService } from 'app/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { PickService } from '../pick.service'

@Component({
  selector: 'wm-pick-new',
  templateUrl: './pick-new.component.html',
  styleUrls: ['./pick-new.component.css']
})
export class PickNewComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
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

  pickCode:any;
  pickDate:any;

  receiveCode:any;
  receiveDate:any;

  isOpenModal:any = false;

  pickQty:any;
  products:any =[];
  receive:any

  constructor(
    private alertService: AlertService,
    @Inject('API_URL') private url: string,
    private pickService: PickService
  ) { }

  ngOnInit() {
    const date = new Date();
    this.pickDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    
  }
  searchReceive(){
    this.isOpenModal = true;
    this.getReceive()
  }

  savePick(){

  }
  clearForm(){

  }
  addProduct(){

  }
  setSelectedProduct(event:any){

  }
  async getReceive(){
    const rs:any = await this.pickService.gerReceiveNotPO()
    try {
      if(rs.ok){
        this.receive = rs.rows
        this.modalLoading.hide()
      }
    } catch (error) {
      this.alertService.error(error)
    }
  }
  addReceive(receiveId:any){

  }
}

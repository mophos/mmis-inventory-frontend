import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AlertService } from '../../alert.service';
import { PickService } from '../pick.service'
@Component({
  selector: 'wm-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.css']
})
export class PickComponent implements OnInit {
  query: any;
  selectedPrint: any = [];
  order: any = [];
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
    this.modalLoading.show();
    let rs:any = await this.pickService.getList();
    try {
      if(rs.ok){
        this.order = rs.rows
        console.log(this.order);
        
        this.modalLoading.hide()
      }
    } catch (error) {
      this.alertService.error(error)
    }
    
  }

  printReport() {

  }
  search() {

  }
  showReport(pick_id:any){

  }
  remove(item:any){
    
  }

}

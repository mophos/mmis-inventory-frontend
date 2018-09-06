import { AlertService } from './../../alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { PickService } from '../../admin/pick.service';
@Component({
  selector: 'wm-pick-detail',
  templateUrl: './pick-detail.component.html',
  styleUrls: ['./pick-detail.component.css']
})
export class PickDetailComponent implements OnInit {
  @Input() pickId: any;
  loading = false;
    list = [];
  constructor(private pickService: PickService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProductList(this.pickId)
  }
  async getProductList(pick_id) {
    this.loading = true;
    console.log(pick_id);
    
    try {
      const result: any = await this.pickService.getDetail(pick_id);
      this.loading = false;
      if (result.ok) {
        this.list = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error(result.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

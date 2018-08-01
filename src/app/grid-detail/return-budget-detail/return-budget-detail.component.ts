import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from './../../alert.service';
import { ReturnBudgetService} from './../../admin/return-budget.service';

@Component({
  selector: 'wm-return-budget-detail',
  templateUrl: './return-budget-detail.component.html',
  styles: []
})
export class ReturnBudgetDetailComponent implements OnInit {
  @Input() purchaseId: any;
  loading = false;
  receives = [];

  constructor(
    private returnBudgetService: ReturnBudgetService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getReceiveList();
  }

  async getReceiveList() {
    this.loading = true;
    try {
      const rs: any = await this.returnBudgetService.getReceivesList(this.purchaseId);
      if (rs.ok) {
        this.receives = rs.rows;
      } else {
        console.log(rs.error);
        this.alertService.error();
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

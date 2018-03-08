import { CountingService } from './../../admin/counting.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-detail-cycle-warehouse-remain',
  templateUrl: './detail-cycle-warehouse-remain.component.html',
  styleUrls: ['./detail-cycle-warehouse-remain.component.css']
})
export class DetailCycleWarehouseRemainComponent implements OnInit {
  @Input('productId') productId: any;

  loading = false;
  items: any = [];

  constructor(
    private alertService: AlertService,
    private countingService: CountingService
  ) { }

  ngOnInit() {
    this.getWarehouseRemain();
  }

  async getWarehouseRemain() {
    try {
      this.loading = true;
      const resp = await this.countingService.getRemainInWarehouse(this.productId);
      if (resp.ok) {
        this.items = resp.rows;
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(JSON.stringify(error.message));
    }
  }

}

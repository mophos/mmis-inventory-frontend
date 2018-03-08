import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from 'app/admin/warehouse.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'wm-receive-planning',
  templateUrl: './receive-planning.component.html',
  styles: []
})
export class ReceivePlanningComponent implements OnInit {

  warehouses: any = [];
  loading: boolean = false;

  @ViewChild('modalLoading') public modalLoading: any;

  constructor(private warehouseService: WarehouseService, private alertService: AlertService) { }

  ngOnInit() {
    this.getReceivePlanning();
  }

  async getReceivePlanning() {
    this.modalLoading.show();
    try {
      let rs = await this.warehouseService.getReceivePlanning();
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

}

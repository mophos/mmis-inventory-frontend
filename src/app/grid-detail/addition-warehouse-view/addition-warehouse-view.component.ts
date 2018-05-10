import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'wm-addition-warehouse-view',
  templateUrl: './addition-warehouse-view.component.html',
  styles: []
})
export class AdditionWarehouseViewComponent implements OnInit {

  @Input('genericId') genericId;
  loading = false;
  warehouses: any = [];

  constructor(
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getGenericWarehouse();
  }

  async getGenericWarehouse() {
    try {
      this.loading = true;
      const rs: any = await this.additionService.getGenericWarehouse(this.genericId);
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

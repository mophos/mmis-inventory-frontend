import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'wm-addition-generic-view',
  templateUrl: './addition-generic-view.component.html',
  styles: []
})
export class AdditionGenericViewComponent implements OnInit {

  @Input('dstWarehouseId') dstWarehouseId;
  loading = false;
  generics: any = [];

  constructor(
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getWarehouseGeneric();
  }

  async getWarehouseGeneric() {
    try {
      this.loading = true;
      const rs: any = await this.additionService.getWarehouseGeneric(this.dstWarehouseId);
      if (rs.ok) {
        this.generics = rs.rows;
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

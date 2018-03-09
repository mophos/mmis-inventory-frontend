import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from './../warehouse.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-his-mappings',
  templateUrl: './his-mappings.component.html'
})
export class HisMappingsComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  mappings = [];

  constructor(
    private warehouseService: WarehouseService, 
    private alertService: AlertService) { }

  ngOnInit() {
    this.getMappings();
  }

  async getMappings() {
    this.modalLoading.show();
    try {
      let rs: any = await this.warehouseService.getMappingsGenerics();
      this.mappings = rs.rows;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
}

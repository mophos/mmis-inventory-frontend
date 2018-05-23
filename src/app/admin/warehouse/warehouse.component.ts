import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WarehouseService } from '../warehouse.service';

import { AlertService } from '../../alert.service';
import { WarehouseTypeService } from '../warehouse-type.service';

@Component({
  selector: 'wm-warehouse',
  templateUrl: './warehouse.component.html'
})
export class WarehouseComponent implements OnInit {

  @ViewChild('locationModal') public locationModal: any;
  @ViewChild('modalLoading') public modalLoading: any;

  opened = false; // open modal
  isUpdate = false;

  hospcode: any;
  depCode: any;
  warehouseId: any;
  warehouseName: string;
  shortCode: string;

  location: string;
  warehouses: any = [];
  types: any = [];

  isEnableWarehouse = false;
  isReceiveWarehouse = false;
  isUnitIssue = false;

  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService,
    private warehouseTypeService: WarehouseTypeService,
    private ref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    // get all warehouse
    this.all();
    this.getWarehouseTypes();
  }

  goDetail(warehouseId) {
    this.router.navigate(['/admin/warehouse/detail', { warehouseId: warehouseId }]);
  }

  getWarehouseTypes() {
    this.warehouseTypeService.all()
      .then((results: any) => {
        if (results.ok) {
          this.types = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  addNew() {
    this.isUpdate = false;
    this.warehouseId = null;
    this.warehouseName = null;
    this.shortCode = null;
    this.isEnableWarehouse = false;
    this.isReceiveWarehouse = false;
    this.isUnitIssue = false;

    this.location = null;
    this.hospcode = null;
    this.depCode = null;

    this.opened = true;
  }

  save() {
    this.modalLoading.show();
    let promise;
    const isActived = this.isEnableWarehouse ? 'Y' : 'N';
    const isReceive = this.isReceiveWarehouse ? 'Y' : 'N';
    const isUnitIssue = this.isUnitIssue ? 'Y' : 'N';
    let wid;
    this.warehouses.forEach(e => {
      wid = e.warehouse_id;
    });

    if (this.warehouseName && this.depCode && this.hospcode) {

      if (this.isUpdate) {
        promise = this.warehouseService.update(this.warehouseId, this.warehouseName, this.shortCode, this.location, isActived, isReceive, isUnitIssue, this.hospcode, this.depCode);
      } else {
        if (this.shortCode == null) {
          this.shortCode = wid + 1;
        }
        promise = this.warehouseService.save(this.warehouseName, this.shortCode, this.location, isActived, isReceive, isUnitIssue, this.hospcode, this.depCode);
      }

      promise
        .then((results: any) => {
          if (results.ok) {
            this.alertService.success();
            this.all();
            this.opened = false;
          } else {
            this.alertService.error(JSON.stringify(results.error));
          }

          this.modalLoading.hide();
        })
        .catch(() => {
          this.modalLoading.hide();
          this.alertService.serverError();
        });

    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบ');
    }

  }

  all() {
    this.modalLoading.show();
    this.warehouses = [];
    this.warehouseService.all()
      .then((results: any) => {
        if (results.ok) {
          this.warehouses = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
        this.modalLoading.hide();
        this.ref.detectChanges();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  showEdit(w: any) {
    this.warehouseId = w.warehouse_id;
    this.warehouseName = w.warehouse_name;
    this.shortCode = w.short_code;
    this.isEnableWarehouse = w.is_actived === 'Y' ? true : false;
    this.isReceiveWarehouse = w.is_receive === 'Y' ? true : false;
    this.isUnitIssue = w.is_unit_issue === 'Y' ? true : false;
    this.location = w.location;
    this.hospcode = w.his_hospcode;
    this.depCode = w.his_warehouse;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(w: any) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${w.warehouse_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.warehouseService.remove(w.warehouse_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
            this.modalLoading.hide();
          });
      })
      .catch(() => {
        // close alert
      });
  }

  openLocation(warehouseId: any) {
    this.locationModal.setWarehouseId(warehouseId);
    this.locationModal.openModal();
  }

  successLocation() { };

  goPlanning(warehouseId: any) {
    this.router.navigate(['/admin/warehouse/planning', { warehouseId: warehouseId }]);
  }

}

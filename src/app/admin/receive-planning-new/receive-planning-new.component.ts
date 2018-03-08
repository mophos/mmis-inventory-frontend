import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { WarehouseService } from 'app/admin/warehouse.service';
import { AlertService } from 'app/alert.service';
import { BasicService } from 'app/basic.service';

@Component({
  selector: 'wm-receive-planning-new',
  templateUrl: './receive-planning-new.component.html',
  styles: []
})
export class ReceivePlanningNewComponent implements OnInit {
  generics: any = [];
  isSaving: boolean = false;

  @ViewChild('slSearchGeneric') public slSearchGeneric;
  @ViewChild('modalLoading') public modalLoading: any;

  selectedGenericId: any;
  selectedGenericName: any;
  selectedWorkingCode: any;
  warehouseId: any;
  loading: boolean = false;

  types: any = [];

  genericTypeId: any;

  constructor(
    private alertService: AlertService,
    private warehouseService: WarehouseService,
    private router: Router,
    private basicService: BasicService
  ) { }

  async ngOnInit() {
    await this.getTypes();
  }

  setSelectedGeneric(event) {
    this.selectedGenericId = event.generic_id;
    this.selectedGenericName = event.generic_name;
    this.selectedWorkingCode = event.working_code;
  }

  addGeneric() {
    let obj: any = {
      generic_id: this.selectedGenericId,
      generic_name: this.selectedGenericName,
      working_code: this.selectedWorkingCode
    };

    let idx = _.findIndex(this.generics, { generic_id: this.selectedGenericId });
    if (idx > -1) {
      this.alertService.error('มีรายการนี้อยู่แล้ว');
    } else {
      this.generics.push(obj);
      this.slSearchGeneric.clearSearch();
    }
    this.selectedGenericId = null;
    this.selectedGenericName = null;
    this.selectedWorkingCode = null;
  }

  save() {
    this.isSaving = true;
    this.loading = true;
    this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        let _generics: any = [];
        this.generics.forEach(v => {
          let obj: any = {};
          obj.generic_id = v.generic_id;
          _generics.push(obj);
        });
        try {
          let rs: any = await this.warehouseService.saveReceivePlanning(this.warehouseId, _generics);
          if (rs.ok) {
            this.router.navigate(['/admin/receive-planning']);
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }

      })
      .catch(() => {
        this.modalLoading.hide();
      });
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

  remove(genericId: any) {
    this.alertService.confirm('ต้องการลบรายการ ใช่หรือไม่?')
      .then(() => {
        let idx = _.findIndex(this.generics, { generic_id: genericId });
        if (idx > -1) {
          this.generics.splice(idx, 1);
        }
      }).catch(() => { });
  }


  async getTypes() {
    this.modalLoading.show();
    try {
      let rs: any = await this.basicService.getGenericTypes();
      if (rs.ok) {
        this.types = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  getAllGenerics() {
    this.alertService.confirm('รายการเดิมจะถูกแทนที่ด้วยรายการใหม่ ท่านต้องการทำต่อใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          let rs: any = await this.warehouseService.getGenericAll();
          if (rs.ok) {
            // set new generics
            this.generics = [];
            this.generics = rs.rows;
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }
      })
      .catch(() => {
        this.modalLoading.hide();
      });
  }

  getByGenericTypes() {
    // clear all generics
    this.alertService.confirm('รายการเดิมจะถูกแทนที่ด้วยรายการใหม่ ท่านต้องการทำต่อใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          let rs: any = await this.warehouseService.getGenericByGenericTypes(this.genericTypeId);
          if (rs.ok) {
            // set new generics
            this.generics = [];
            this.generics = rs.rows;
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }
      })
      .catch(() => {
        this.modalLoading.hide();
      });
  }

  removeAllGenerics() {
    this.alertService.confirm('ต้องการลบรายการทั้งหมด ใช่หรือไม่? (หลังจากลบแล้วกรุณากดบันทึก)')
      .then(() => {
        this.generics = [];
      })
      .catch(() => { /* cancel */ });
  }

}

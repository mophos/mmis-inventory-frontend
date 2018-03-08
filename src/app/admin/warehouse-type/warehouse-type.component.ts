import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { WarehouseTypeService } from '../warehouse-type.service';

import { IType, ITypeStructure } from '../../models';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-warehouse-type',
  templateUrl: './warehouse-type.component.html',
  styleUrls: ['./warehouse-type.component.css']
})
export class WarehouseTypeComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  types: any = [];

  opened = false; // open 
  isUpdate = false;

  typeId: any;
  typeName: string;
  typeDesc: string;
  isMain = false;
  isUnit = true;

  constructor(
    private warehouseTypeService: WarehouseTypeService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.all();
  }

  addNew() {
    this.isUpdate = false;
    this.typeId = null;
    this.typeName = null;
    this.typeDesc = null;
    this.isMain = false;    
    this.opened = true;
  }

  save() {
    this.modalLoading.show();
    const _isMain = this.isMain ? 'Y' : 'N';    
    let promise;
    if (this.isUpdate) {
      promise = this.warehouseTypeService.update(this.typeId, this.typeName, this.typeDesc, _isMain);
    } else {
      promise = this.warehouseTypeService.save(this.typeName, this.typeDesc, _isMain);
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
  }

  all() {
    this.modalLoading.show();
    this.types = [];
    this.warehouseTypeService.all()
      .then((results: any) => {
        if (results.ok) {
          this.types = results.rows;
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
    this.typeId = w.type_id;
    this.typeName = w.type_name;
    this.typeDesc = w.type_desc;
    this.isMain = w.is_main === 'Y' ? true : false;    
    // set update flag
    this.isUpdate = true;
    // open modal
    this.opened = true;
  }

  remove(w: any) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${w.type_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.warehouseTypeService.remove(w.type_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error))
            }
            this.modalLoading.hide();
          });
      })
      .catch(() => {
        // hide alert
      });
  }

}

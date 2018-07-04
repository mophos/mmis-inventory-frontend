import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { RequisitionTypeService } from '../requisition-type.service';

import { IRequisitionType, IRequisitionTypeStructure } from '../../models';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-requisition-type',
  templateUrl: './requisition-type.component.html',
  styleUrls: ['./requisition-type.component.css']
})
export class RequisitionTypeComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;

  requisitiontype: any = [];

  opened = false; // open modal
  isUpdate = false;

  requisitionTypeId: any;
  requisitionTypeName: string;
  requisitionTypeDesc: string;


  constructor(
    private requisiotionTypeService: RequisitionTypeService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.all();
  }

  addNew() {
    this.isUpdate = false;
    this.requisitionTypeId = null;
    this.requisitionTypeName = null;
    this.requisitionTypeDesc = null;
    this.opened = true;
  }

  save() {
    this.modalLoading.show();
    let promise;
    if (this.isUpdate) {
      promise = this.requisiotionTypeService.update(this.requisitionTypeId, this.requisitionTypeName, this.requisitionTypeDesc);
    } else {
      promise = this.requisiotionTypeService.save(this.requisitionTypeName, this.requisitionTypeDesc);
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
    this.requisitiontype = [];
    this.requisiotionTypeService.all()
      .then((results: any) => {
        if (results.ok) {
          this.requisitiontype = results.rows;
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

  showEdit(w: IRequisitionTypeStructure) {
    this.requisitionTypeId = w.requisition_type_id;
    this.requisitionTypeName = w.requisition_type;
    this.requisitionTypeDesc = w.requisition_type_desc;
    // set update flag
    this.isUpdate = true;
    // open modal
    this.opened = true;
  }

  remove(w: IRequisitionTypeStructure) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${w.requisition_type}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.requisiotionTypeService.remove(w.requisition_type_id)
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

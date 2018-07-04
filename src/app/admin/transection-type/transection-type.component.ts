
import { Component, OnInit, ViewChild } from '@angular/core';
import { TransectionTypeService } from '../transection-type.service';
import { AlertService } from '../../alert.service';
import { ITransectionTypeStructure } from 'app/models';

@Component({
  selector: 'wm-transection-type',
  templateUrl: './transection-type.component.html',
  styles: []
})
export class TransectionTypeComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  transectiontype = [];
  opened = false;
  isUpdate = false;



  transectionTypeId: any;
  transectionTypeName: any;
  constructor(private transectionTypeService: TransectionTypeService, private alertService: AlertService) { }

  ngOnInit() {
    this.all();
  }
  save() {
    this.modalLoading.show();
    let promise;
    if (this.isUpdate) {
      promise = this.transectionTypeService.update(this.transectionTypeId, this.transectionTypeName);
    } else {
      promise = this.transectionTypeService.save(this.transectionTypeName);
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
    this.transectionTypeService.all()
      .then((results: any) => {
        if (results.ok) {
          this.transectiontype = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
        this.modalLoading.hide();
        // this.ref.detectChanges();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  showEdit(w: ITransectionTypeStructure) {
    this.transectionTypeId = w.transaction_id;
    this.transectionTypeName = w.transaction_name;
    // set update flag
    this.isUpdate = true;
    // open modal
    this.opened = true;
  }

  remove(w: ITransectionTypeStructure) {
    this.alertService.confirm(`คุณต้องการลบรายการ [${w.transaction_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.transectionTypeService.remove(w.transaction_id)
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
  addNew() {
    this.isUpdate = false;
    this.transectionTypeId = null;
    this.transectionTypeName = null;
    this.opened = true;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ReceiveotherTypeService } from '../receiveother-type.service';
import { AlertService } from '../../alert.service';
import { IReceiveotherTypeStructure } from 'app/models';


@Component({
  selector: 'wm-receiveother-type',
  templateUrl: './receiveother-type.component.html',
  styles: []
})
export class ReceiveotherTypeComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  receiveothertype = [];
  opened = false;
  isUpdate = false;



  receiveotherTypeId: any;
  receiveotherTypeName: any;
  constructor(private receiveotherTypeService: ReceiveotherTypeService, private alertService: AlertService) { }

  ngOnInit() {
    this.all();
  }
  save() {
    this.modalLoading.show();
    let promise;
    if (this.isUpdate) {
      promise = this.receiveotherTypeService.update(this.receiveotherTypeId, this.receiveotherTypeName);
    } else {
      promise = this.receiveotherTypeService.save(this.receiveotherTypeName);
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
    this.receiveotherTypeService.all()
      .then((results: any) => {
        if (results.ok) {
          this.receiveothertype = results.rows;
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

  showEdit(w: IReceiveotherTypeStructure) {
    this.receiveotherTypeId = w.receive_type_id;
    this.receiveotherTypeName = w.receive_type_name;
    // console.log("this is unitissue id: " + this.unitIssueId);
    // console.log("this is unitissue name: " + this.unitIssueName);
    // set update flag
    this.isUpdate = true;
    // open modal
    this.opened = true;
  }

  remove(w: IReceiveotherTypeStructure) {
    this.alertService.confirm(`คุณต้องการลบรายการ [${w.receive_type_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.receiveotherTypeService.remove(w.receive_type_id)
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
        // hide alert
      });
  }
  addNew() {
    this.isUpdate = false;
    this.receiveotherTypeId = null;
    this.receiveotherTypeName = null;
    this.opened = true;
  }
}

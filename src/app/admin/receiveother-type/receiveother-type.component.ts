import { Component, OnInit, ViewChild } from '@angular/core';
import { ReceiveotherTypeService } from '../receiveother-type.service';
import { AlertService } from '../../alert.service';
import { IReceiveotherTypeStructure } from 'app/models';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash'

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

  btnDelete = false
  menuDelete = false
  jwtHelper: JwtHelper = new JwtHelper();
  query:any = ''
  receiveotherTypeId: any;
  receiveotherTypeName: any;
  constructor(private receiveotherTypeService: ReceiveotherTypeService, private alertService: AlertService) { 
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.menuDelete = _.indexOf(accessRight, 'MM_DELETED') === -1 ? false : true;
    console.log(accessRight);
  }

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
    this.receiveotherTypeService.all(this.query,this.btnDelete)
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
  async returnDelete(receive_type_id) {
    this.modalLoading.show();
    try {
      const resp: any = await this.receiveotherTypeService.returnDelete(receive_type_id);
      this.modalLoading.hide();
      if (resp.ok) {
        const idx = _.findIndex(this.receiveothertype, { 'receive_type_id': receive_type_id })
        this.receiveothertype[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.all();
  }

  async searcReceiveothertype(even){
    this.all()
  }
}

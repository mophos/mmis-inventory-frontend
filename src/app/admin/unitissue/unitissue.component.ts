import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UnitissueService } from '../unitissue.service';

import { IUnitIssue, IUnitIssueStructure } from '../../models';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-unitissue',
  templateUrl: './unitissue.component.html',
  styleUrls: ['./unitissue.component.css']
})
export class UnitissueComponent implements OnInit {
  unitissues: any = [];

  opened = false; // open modal
  loading = false; // loading for datagrid
  isSaving = false;
  isUpdate = false;

  unitIssueId: any;
  unitIssueName: string;
  unitIssueDesc: string;

  isRawmaterial = false;

  constructor(
    private unitissueService: UnitissueService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // get all unitissue
    this.all();
  }

  addNew() {
    this.isUpdate = false;
    this.unitIssueId = null;
    this.unitIssueName = null;
    this.unitIssueName = null;
    this.isRawmaterial = false;
    this.opened = true;
  }

  save() {
    this.isSaving = true;
    let promise;
    const isRawmaterial = this.isRawmaterial ? 'Y' : 'N';
    if (this.isUpdate) {
      promise = this.unitissueService.update(this.unitIssueId, this.unitIssueName, this.unitIssueDesc, isRawmaterial);
    } else {
      promise = this.unitissueService.save(this.unitIssueName, this.unitIssueDesc, isRawmaterial);
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

        this.isSaving = false;
      })
      .catch(() => {
        this.isSaving = false;
        this.alertService.serverError();
      });
  }

  all() {
    this.loading = true;
    this.unitissues = [];
    this.unitissueService.all()
      .then((results: any) => {
        if (results.ok) {
          this.unitissues = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
        this.loading = false;
        this.ref.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

  showEdit(w: IUnitIssueStructure) {
    this.unitIssueId = w.unitissue_id;
    this.unitIssueName = w.unitissue_name;
    this.unitIssueDesc = w.unitissue_desc;
    this.isRawmaterial = w.is_rawmaterial === 'Y' ? true : false;
    // set update flag
    this.isUpdate = true;
    // open modal
    this.opened = true;
  }

  remove(w: IUnitIssueStructure) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${w.unitissue_name}] ใช่หรือไม่?`)
      .then(() => {
        this.unitissueService.remove(w.unitissue_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error))
            }
          });
      })
      .catch(() => {
        // hide alert
      });
  }

}

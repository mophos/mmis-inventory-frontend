import { AlertService } from './../../alert.service';
import { DonatorService } from './../donator.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';

@Component({
  selector: 'wm-donators',
  templateUrl: './donators.component.html',
  styleUrls: ['./donators.component.css']
})
export class DonatorsComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  donators: any = [];

  opened = false; // open modal
  isUpdate = false;

  donatorId: any;
  donatorName: string;
  donatorAddress: string;
  donatorTelephone: string;

  constructor(
    private donatorService: DonatorService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.all();
  }

  addNew() {
    this.isUpdate = false;
    this.donatorId = null;
    this.donatorName = null;
    this.donatorAddress = null;
    this.donatorTelephone = null;
    this.opened = true;
  }

  async save() {
    this.modalLoading.show();
    try {
      let results;
      if (this.isUpdate) {
        results = await this.donatorService.update(this.donatorId, this.donatorName, this.donatorAddress, this.donatorTelephone);
      } else {
        results = await this.donatorService.save(this.donatorName, this.donatorAddress, this.donatorTelephone);
      }

      if (results.ok) {
        this.alertService.success();
        this.all();
        this.opened = false;
      } else {
        this.alertService.error(JSON.stringify(results.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  async all() {
    this.modalLoading.show();
    try {
      this.donators = [];
      const results = await this.donatorService.all();
      if (results.ok) {
        this.donators = results.rows;
      } else {
        this.alertService.error(JSON.stringify(results.error));
      }
      this.modalLoading.hide();
      this.ref.detectChanges();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  showEdit(donator: any) {
    this.donatorId = donator.donator_id;
    this.donatorName = donator.donator_name;
    this.donatorAddress = donator.donator_address;
    this.donatorTelephone = donator.donator_telephone;

    this.isUpdate = true;
    this.opened = true;
  }

  remove(donator: any) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${donator.donator_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.donatorService.remove(donator.donator_id)
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

}

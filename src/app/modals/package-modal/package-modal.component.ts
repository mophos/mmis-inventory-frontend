import { ReceiveService } from './../../admin/receive.service';
import { AlertService } from './../../alert.service';
import { PackageService } from './../../admin/packages.service';
import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'wm-package-modal',
  templateUrl: './package-modal.component.html',
  styleUrls: ['./package-modal.component.css']
})
export class PackageModalComponent implements OnInit {
  productPackages: any = [];
  selectedPackages: any = [];
  packages: any = [];
  openPackages = false;
  openAllPackage = false;
  productId: any;
  loading = false;
  loadingPackages = false;

  @Output("onSuccess") onSuccess = new EventEmitter<boolean>();
  @Input("openPackagesModal") openPackagesModal = false;

  constructor(
    private packageService: PackageService,
    private receiveService: ReceiveService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  async savePackages() {
    const data = [];
    if (this.selectedPackages.length > 0) {
      this.selectedPackages.forEach(v => {
        const idx = _.findIndex(this.productPackages, { package_id: +v.package_id });
        if (idx === -1) {
          data.push({
            product_id: this.productId,
            package_id: v.package_id
          });
        }
      });
      try {
        // const resp: any = await this.receiveService.saveProductPackages(this.productId, data);
        // if (resp.ok) {
        //   this.alertService.success();
        //   this.openPackages = false;
        //   this.getProductPackages(this.productId);
        // } else {
        //   this.alertService.error(resp.error);
        // }
      } catch (error) {
        this.alertService.error(error.message);
      }
    } else {
      this.alertService.error('กรุณาเลือก Package ที่ต้องการ');
    }
  }

  async openPackage(productId: any) {
    this.productId = productId;
    this.getProductPackages(productId);
  }

  async getProductPackages(productId: any) {
    try {
      // this.loading = true;
      // const resp: any = await this.receiveService.getPackageList(productId);
      // if (resp.ok) {
      //   this.productPackages = resp.rows;
      // } else {
      //   this.alertService.error(resp.error);
      // }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message)
    }
  }

  async getAllPackage() {
    try {
      // this.loadingPackages = true;
      // const resp: any = await this.receiveService.getAllPackages();
      // if (resp.ok) {
      //   this.packages = resp.rows;
      // } else {
      //   this.alertService.error(resp.error);
      // }
      this.loadingPackages = false;
    } catch (error) {
      this.loadingPackages = false;
      this.alertService.error(error.message);
    }
  }

  removePackage(packages: any) {
    this.alertService.confirm(`ต้องการบบรายการนี้ [${packages.large_unit}/${packages.small_unit}] ใช่หรือไม่`)
      .then(() => {
        // this.receiveService.removeProductPackages(this.productId, packages.package_id)
        //   .then((resp: any) => {
        //     if (resp.ok) {
        //       this.alertService.success();
        //       this.getProductPackages(this.productId);
        //     } else {
        //       this.alertService.error(resp.error);
        //     }
        //   });
      })
      .catch(() => { });
  }

  async addPackage() {
    this.openPackages = true;
    this.getAllPackage();
  }

  closeModal() {
    this.onSuccess.emit(true);
  }

}

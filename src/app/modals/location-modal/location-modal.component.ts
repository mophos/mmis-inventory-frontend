import { UsersService } from './../../users.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { LotService } from 'app/admin/lot.service';
import { DateService } from 'app/date.service';
import * as moment from 'moment';
import { LocationService } from 'app/admin/location.service';

@Component({
  selector: 'wm-location-modal',
  templateUrl: './location-modal.component.html'
})
export class LocationModalComponent implements OnInit {
  @Output("onSuccess") onSuccess = new EventEmitter<boolean>();
  @ViewChild('modalLoading') modalLoading;

  warehouseId: any;

  locations = [];
  locationName: string;
  locationDesc: any;
  locationId: any;
  dimensionHeight = 0;
  dimensionWidth = 0;
  dimensionLength = 0;
  locationLength = 0;
  locationMaxItems = 0;

  isActive = false;
  isUpdate = false;
  
  open: boolean = false;

  constructor(
    private locationService: LocationService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }

  setWarehouseId(warehouseId: any) {
    this.warehouseId = warehouseId;
  }

  getLocations() {
    this.locations = [];
    this.modalLoading.show();
    this.locationService.all(this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.locations = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(error => {
        this.modalLoading.hide();
        this.alertService.error(error.messag);
      });
  }

  editLocation(location: any) {
    this.isUpdate = true;
    this.locationName = location.location_name;
    this.locationDesc = location.location_desc;
    this.dimensionWidth = location.dimension_width;
    this.dimensionHeight = location.dimension_height;
    this.dimensionLength = location.dimension_length;
    this.locationMaxItems = location.max_items;
    this.locationId = location.location_id;
    this.isActive = location.is_active === 'Y' ? true : false;
    this.locations.forEach(v => {
      if (v.location_id === location.location_id) {
        v.is_update = 'Y';
      } else {
        v.is_update = 'N';
      }
    });

  }

  async saveLocation() {
    if (this.locationName) {
      let resp;
      const _isActive = this.isActive ? 'Y' : 'N';
      try {
        this.modalLoading.show();
        const location: any = {};
        location.location_name = this.locationName;
        location.location_desc = this.locationDesc;
        location.dimension_height = this.dimensionHeight;
        location.dimension_length = this.dimensionLength;
        location.dimension_width = this.dimensionWidth;
        location.max_items = this.locationMaxItems;
        location.is_active = _isActive;

        if (this.isUpdate) {
          location.location_id = this.locationId;
          resp = await this.locationService.update(location);
        } else {
          resp = await this.locationService.save(location, this.warehouseId);
        }

        if (resp.ok) {
          this.alertService.success();
          this.getLocations();
          this.resetForm();
        } else {
          this.alertService.error(JSON.stringify(resp.error));
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  async removeLocation(location: any) {
    this.alertService.confirm('ต้องการลบรายการ ใช่หรือไม่? [' + location.location_name + ']')
      .then(() => {
        this.modalLoading.show();
        this.locationService.remove(location.location_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getLocations();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.error);
          });
      })
      .catch(() => {
      // no action
      });
  }

  resetForm() {
    this.locationName = null;
    this.locationDesc = null;
    this.dimensionWidth = 0;
    this.dimensionHeight = 0;
    this.dimensionLength = 0;
    this.locationMaxItems = 0;
    this.locationId = null;
    this.isActive = true;
    this.isUpdate = false;

    this.locations.forEach(v => {
      v.is_update = 'N';
    });
  }

  openModal() {
    this.open = true;
    this.getLocations();
  }

  closeModal() {
    this.onSuccess.emit(true);
    this.open = false;
  }


}

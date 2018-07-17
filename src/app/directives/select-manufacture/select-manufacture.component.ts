import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-manufacture',
  templateUrl: './select-manufacture.component.html',
  styleUrls: ['./select-manufacture.component.css']
})
export class SelectManufactureComponent implements OnInit {

  manufactureId: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public selectedId: any;
  @Input() public genericId: any;
  manufactures: any = [];
  loading = false;

  constructor(private basicService: BasicService, private alertService: AlertService) { }

  ngOnInit() {
    if (this.genericId) {
      this.getManufacture(this.genericId);
    }
  }

  async getManufacture(genericId: any) {
    try {
      this.loading = true;
      this.manufactures = [];
      const res = await this.basicService.getProductManufactures(genericId);
      this.loading = false;
      if (res.ok) {
        this.manufactures = res.rows;
        console.log(this.manufactures)
        if (this.manufactures.length) {
          if (this.selectedId) {
            this.manufactureId = this.selectedId;
          } else {
            this.manufactureId = this.manufactures[0].labeler_id;
          }
          this.onSelect.emit(this.manufactures[0]);
        }

      } else {
        this.loading = false;
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    const idx = _.findIndex(this.manufactures, { labeler_id: +this.manufactureId });
    this.onSelect.emit(this.manufactures[idx]);
  }

  clearVendor() {
    this.manufactures = [];
  }

}

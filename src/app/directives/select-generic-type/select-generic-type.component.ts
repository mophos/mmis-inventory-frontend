import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicService } from '../../basic.service';
import { AlertService } from '../../alert.service';
import * as _ from 'lodash';
@Component({
  selector: 'wm-select-generic-type',
  templateUrl: './select-generic-type.component.html',
  styles: []
})
export class SelectGenericTypeComponent implements OnInit {

  genericTypes = [];
  genericTypeId = null;
  loading = false;
  @Input('disabled') disabled;

  @Input('selectedId')
  set setSelectedId(val) {
    this.genericTypeId = val;
  }

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();


  constructor(private basicService: BasicService, private alertService: AlertService) { }

  ngOnInit() {
    this.getGenericTypes();
  }

  async getGenericTypes() {
    this.loading = true;
    try {
      this.genericTypes = [];
      const res = await this.basicService.getGenericTypes();
      this.loading = false;
      if (res.ok) {
        this.genericTypes = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    const idx = _.findIndex(this.genericTypes, { generic_type_id: +this.genericTypeId });
    this.onSelect.emit(this.genericTypes[idx]);
  }

  clearSelected() {
    this.genericTypeId = null;
  }

  clearWarehouses() {
    this.genericTypes = [];
  }
}

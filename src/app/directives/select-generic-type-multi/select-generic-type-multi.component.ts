import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicService } from '../../basic.service';
import { AlertService } from '../../alert.service';
import * as _ from 'lodash';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-select-generic-type-multi',
  templateUrl: './select-generic-type-multi.component.html',
  styles: []
})
export class SelectGenericTypeMultiComponent implements OnInit {

  genericTypesLV1 = [];
  genericTypesLV2 = [];
  genericTypesLV3 = [];
  _genericTypesLV1 = [];
  _genericTypesLV2 = [];
  _genericTypesLV3 = [];
  genericTypeLV1Id = 'null';
  genericTypeLV2Id = 'null';
  genericTypeLV3Id = 'null';
  genericTypeId = 'null';
  loading = false;
  modal = false;
  jwtHelper: JwtHelper = new JwtHelper();



  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();


  constructor(private basicService: BasicService, private alertService: AlertService) { }

  public test() {
    return 'ddddd';
  }
  getDefaultGenericType() {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const obj = {
      'generic_type_lv1_id': decoded.generic_type_id ? decoded.generic_type_id.split(',') : [],
      'generic_type_lv2_id': decoded.generic_type_lv2_id ? decoded.generic_type_lv2_id.split(',') : [],
      'generic_type_lv3_id': decoded.generic_type_lv3_id ? decoded.generic_type_lv3_id.split(',') : []
    }
    return obj;
  }

  cancelFilter() {
    this.onSelect.emit(this.getDefaultGenericType());
  }

  changeGenericType() {
    this.genericTypeLV1Id = this.genericTypeId;
    this.getGenericTypesLV2();

    this.onSelect.emit(this.generateObj());
  }


  generateObj() {
    if (this.genericTypeLV1Id === 'null') {
      this.genericTypeLV2Id = null;
      this.genericTypeLV3Id = null;
    }

    if (this.genericTypeLV2Id === 'null') {
      this.genericTypeLV3Id = null;
    }

    const obj: any = {
      generic_type_lv1_id: this.genericTypeLV1Id === 'null' || !this.genericTypeLV1Id ? [] : typeof this.genericTypeLV1Id === "string" ? [this.genericTypeLV1Id] : this.genericTypeLV1Id,
      generic_type_lv2_id: this.genericTypeLV2Id === 'null' || !this.genericTypeLV2Id ? [] : typeof this.genericTypeLV2Id === "string" ? [this.genericTypeLV2Id] : this.genericTypeLV2Id,
      generic_type_lv3_id: this.genericTypeLV3Id === 'null' || !this.genericTypeLV3Id ? [] : typeof this.genericTypeLV3Id === "string" ? [this.genericTypeLV3Id] : this.genericTypeLV3Id
    }
    return obj;
  }

  ngOnInit() {
    this.getGenericTypesLV1();
  }

  selectGenericTypeLV1Id() {
    this.genericTypeId = this.genericTypeLV1Id
    this.getGenericTypesLV2();
  }

  selectGenericTypeLV2Id() {
    this.getGenericTypesLV3();
  }

  async getGenericTypesLV1() {
    this.loading = true;
    try {
      this.genericTypesLV1 = [];
      const res = await this.basicService.getGenericTypesLV1();
      this.loading = false;
      if (res.ok) {
        this.genericTypesLV1 = res.rows;
        for (const i of res.rows) {
          this._genericTypesLV1.push(i.generic_type_id);
        }
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  async getGenericTypesLV2() {
    this.loading = true;
    try {
      this.genericTypesLV2 = [];
      const res = await this.basicService.getGenericTypesLV2(this.genericTypeLV1Id);
      this.loading = false;
      if (res.ok) {
        this.genericTypesLV2 = res.rows;
        for (const i of res.rows) {
          this._genericTypesLV2.push(i.generic_type_lv2_id);
        }
        // if (this.genericTypesLV2.length > 0) {
        //   this.genericTypeLV2Id = this.genericTypesLV2[0].generic_type_lv2_id;
        // }
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  async getGenericTypesLV3() {
    this.loading = true;
    try {
      this.genericTypesLV3 = [];
      const res = await this.basicService.getGenericTypesLV3(this.genericTypeLV1Id, this.genericTypeLV2Id);
      this.loading = false;
      if (res.ok) {
        this.genericTypesLV3 = res.rows;
        for (const i of res.rows) {
          this._genericTypesLV3.push(i.generic_type_lv3_id);
        }
        // if (this.genericTypesLV3.length > 0) {
        //   this.genericTypeLV3Id = this.genericTypesLV3[0].generic_type_lv3_id;
        // }
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  save() {
    this.onSelect.emit(this.generateObj());
    this.modal = false;
  }
  // setSelect(event) {
  //   const idx = _.findIndex(this.genericTypes, { generic_type_id: +this.genericTypeId });
  //   this.onSelect.emit(this.genericTypes[idx]);
  // }

  // clearSelected() {
  //   this.genericTypeId = null;
  // }

  // clearWarehouses() {
  //   this.genericTypes = [];
  // }
}

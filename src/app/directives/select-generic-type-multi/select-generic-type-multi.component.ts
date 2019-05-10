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
  genericTypeLV1Id = 'null';
  genericTypeLV2Id = 'null';
  genericTypeLV3Id = 'null';
  genericTypeId = 'null';
  loading = false;
  modal = false;
  jwtHelper: JwtHelper = new JwtHelper();
  decoded: any;


  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();


  constructor(private basicService: BasicService, private alertService: AlertService) {
    const token = sessionStorage.getItem('token');
    this.decoded = this.jwtHelper.decodeToken(token);
  }

  public test() {
    return 'ddddd';
  }
  getDefaultGenericType() {
    const obj = {
      'generic_type_lv1_id': this.decoded.generic_type_id ? this.decoded.generic_type_id.split(',') : [],
      'generic_type_lv2_id': this.decoded.generic_type_lv2_id ? this.decoded.generic_type_lv2_id.split(',') : [],
      'generic_type_lv3_id': this.decoded.generic_type_lv3_id ? this.decoded.generic_type_lv3_id.split(',') : []
    }
    return obj;
  }

  cancelFilter() {
    this.onSelect.emit(this.getDefaultGenericType());
  }

  changeGenericType() {
    this.genericTypeLV1Id = this.genericTypeId;
    this.getGenericTypesLV2();
    this.genericTypeLV2Id = 'null';
    this.getGenericTypesLV3();
    this.genericTypeLV3Id = 'null';
    this.onSelect.emit(this.generateObj());
  }


  generateObj() {
    let _genericTypesLV1 = this.genericTypeLV1Id;
    let _genericTypesLV2 = this.genericTypeLV2Id;
    let _genericTypesLV3 = this.genericTypeLV3Id;

    if (this.genericTypeLV1Id === 'null' || this.genericTypeLV1Id === null) {
      _genericTypesLV1 = this.decoded.generic_type_id ? this.decoded.generic_type_id.split(',') : null;
    }
    if (this.genericTypeLV2Id === 'null' || this.genericTypeLV2Id === null) {
      _genericTypesLV2 = this.decoded.generic_type_lv2_id ? this.decoded.generic_type_lv2_id.split(',') : null;
    }
    if (this.genericTypeLV3Id === 'null' || this.genericTypeLV3Id === null) {
      _genericTypesLV3 = this.decoded.generic_type_lv3_id ? this.decoded.generic_type_lv3_id.split(',') : null;
    }

    const obj: any = {
      generic_type_lv1_id: _genericTypesLV1 === 'null' || !_genericTypesLV1 ? [] : typeof _genericTypesLV1 === "string" ? [_genericTypesLV1] : _genericTypesLV1,
      generic_type_lv2_id: _genericTypesLV2 === 'null' || !_genericTypesLV2 ? [] : typeof _genericTypesLV2 === "string" ? [_genericTypesLV2] : _genericTypesLV2,
      generic_type_lv3_id: _genericTypesLV3 === 'null' || !_genericTypesLV3 ? [] : typeof _genericTypesLV3 === "string" ? [_genericTypesLV3] : _genericTypesLV3
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
        // for (const i of res.rows) {
        //   this._genericTypesLV1.push(i.generic_type_id);
        // }
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
        // for (const i of res.rows) {
        //   this._genericTypesLV2.push(i.generic_type_lv2_id);
        // }
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
        // for (const i of res.rows) {
        //   this._genericTypesLV3.push(i.generic_type_lv3_id);
        // }
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

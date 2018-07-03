import { ReceiveService } from "./../../admin/receive.service";
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
@Component({
  selector: 'wm-show-units',
  templateUrl: './show-units.component.html'
})
export class ShowUnitsComponent implements OnInit {

  @Input() public genericId: any;
  @Input() public selectedUnitId: any;
  @Input() public selectedUnitGenericId: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  units = [];
  unitId = null;
  unitGenericId = null;
  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUnits();
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +this.selectedUnitGenericId });
    if (idx > -1) {
      this.onSelect.emit(this.units[idx]);
    }
  }

  getUnits() {
    this.receiveService.getUnitConversion(this.genericId)
      .then((result: any) => {
        if (result.ok) {
          this.units = result.rows;
          this.unitId = this.selectedUnitId;
          this.unitGenericId = this.selectedUnitGenericId;
          this.selectedUnitGenericId = this.units[0].unit_generic_id;
        } else {
          console.log(result.error);
          this.alertService.error();
        }
      })
      .catch(error => {
        this.alertService.error(error.message)
      });
  }
}

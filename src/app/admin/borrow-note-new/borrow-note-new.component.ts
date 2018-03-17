import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';
import { SelectReceiveUnitComponent } from '../../directives/select-receive-unit/select-receive-unit.component';
import { SearchProductComponent } from '../../directives/search-product/search-product.component';
import { AlertService } from 'app/alert.service';
import { SearchGenericAutocompleteComponent } from '../../directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-borrow-note-new',
  templateUrl: './borrow-note-new.component.html',
  styles: []
})
export class BorrowNoteNewComponent implements OnInit {

  @ViewChild('elUnitList') elUnitList: SelectReceiveUnitComponent;
  @ViewChild('elSearchGeneric') elSearchGeneric: SearchGenericAutocompleteComponent;

  generics: any = [];
  borrowDate: any;
  peopleId: any;
  warehouseName: any;
  remark: any;

  selectedGenericId: any;
  selectedGenericName: any;
  selectedUnitGenericId: any;
  selectedQty: number = 0;
  selectedConversionQty: number = 0;
  selectedPrimaryUnitName = null;
  
  dateOption: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: false
  };

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const date = new Date();

    this.borrowDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  addProduct() {
    let obj: any = {};
    obj.product_id = this.selectedGenericId;
    obj.generic_id = this.selectedGenericId;
    obj.generic_name = this.selectedGenericName;
    obj.unit_generic_id = this.selectedUnitGenericId;
    obj.qty = this.selectedQty; // pack
    obj.conversion_qty = this.selectedConversionQty;
    obj.to_unit_name = this.selectedPrimaryUnitName;
    
    this.generics.push(obj);
    this.elSearchGeneric.clearSearch();
    this.elUnitList.clearUnits();

    this.clearForm();
  }

  clearForm() {
    this.elSearchGeneric.clearSearch();
    this.selectedGenericId = null;
    this.selectedConversionQty = 0;
    this.selectedGenericId = null;
    this.selectedPrimaryUnitName = null;
    this.selectedGenericName = null;
    this.selectedQty = 0;
  }

  editChangeQty(idx: number, qty: number) {
    this.generics[idx].qty = qty;
  }

  editChangeUnit(idx: number, event: any) {
    this.generics[idx].conversion_qty = event.qty;
    this.generics[idx].to_unit_name = event.to_unit_name;
    this.generics[idx].unit_generic_id = event.unit_generic_id;
  }

  removeSelectedGeneric(idx: number) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.generics[idx].splice(idx, 1);
      }).catch(() => { });
  }

  setSelectedGeneric(event: any) {
    console.log(event);
    this.selectedGenericName = event ? event.generic_name : null;
    this.selectedGenericId = event ? event.generic_id : null;
    this.selectedQty = 1;

    this.elUnitList.getUnits(this.selectedGenericId);
  }

  onChangeSearchGeneric(event: any) {
    console.log(event);
    if (event) this.selectedGenericId = null;
  }

  changeUnit(event: any) {
    console.log(event);
    this.selectedUnitGenericId = event ? event.unit_generic_id : null;
    this.selectedConversionQty = event ? event.qty : 0;
    this.selectedPrimaryUnitName = event ? event.to_unit_name : null;
  }

  onSelectedPeople(event: any) {
    this.peopleId = event ? event.people_id : null;
  }

  onChangePeople(event: any) {
    if (event) this.peopleId = null;
  }

  save() {

  }

}

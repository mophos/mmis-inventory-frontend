import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';
import * as _ from 'lodash';

import { SelectReceiveUnitComponent } from '../../directives/select-receive-unit/select-receive-unit.component';
import { SearchProductComponent } from '../../directives/search-product/search-product.component';
import { AlertService } from 'app/alert.service';
import { SearchGenericAutocompleteComponent } from '../../directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { BorrowNoteService } from '../borrow-note.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchPeopleAutoCompleteComponent } from '../../directives/search-people-autocomplete/search-people-autocomplete.component';

@Component({
  selector: 'wm-borrow-note-new',
  templateUrl: './borrow-note-new.component.html',
  styles: []
})
export class BorrowNoteNewComponent implements OnInit {

  @ViewChild('elUnitList') elUnitList: SelectReceiveUnitComponent;
  @ViewChild('elSearchGeneric') elSearchGeneric: SearchGenericAutocompleteComponent;
  @ViewChild('elSearchPeople') elSearchPeople: SearchPeopleAutoCompleteComponent;
  
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

  borrowNoteId: any;

  constructor(
    private alertService: AlertService,
    private borrowNoteService: BorrowNoteService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.borrowNoteId = this.route.snapshot.params.borrowNoteId;
  }

  async ngOnInit() {
    const date = new Date();

    this.borrowDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    if (this.borrowNoteId) {
      // get detail
      await this.getNotesWithItems();
    }
  }

  async getNotesWithItems() {
    try {
      let rs: any = await this.borrowNoteService.getDetailWithItems(this.borrowNoteId);
      if (rs.ok) {
        this.generics = rs.items || null;
        let detail = rs.detail || {};
        
        if (detail.borrow_date) {
          this.borrowDate = {
            date: {
              year: moment(detail.borrow_date).get('year'),
              month: moment(detail.borrow_date).get('month'),
              day: moment(detail.borrow_date).get('date')
            }
          };
        }

        this.remark = detail.remark || null;
        this.elSearchPeople.setDefault(detail.fullname);
        this.peopleId = detail.people_id;
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  addGeneric() {
    let idx = _.findIndex(this.generics, { generic_id: this.selectedGenericId });

    if (idx === -1) {
      let obj: any = {};
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
    } else {
      this.alertService.error('รายการนี้มีอยู่แล้ว กรุณาเลือกรายการใหม่')
    }
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
    this.selectedGenericName = event ? event.generic_name : null;
    this.selectedGenericId = event ? event.generic_id : null;
    this.selectedQty = 1;

    this.elUnitList.getUnits(this.selectedGenericId);
  }

  onChangeSearchGeneric(event: any) {
    if (event) this.selectedGenericId = null;
  }

  changeUnit(event: any) {
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
    let borrowDate = `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}`;
    if (this.peopleId && this.borrowDate && this.generics.length) {
      this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
        .then(async () => {
          try {

            let notes: any = {};
            notes.borrow_date = borrowDate;
            notes.people_id = this.peopleId;
            notes.remark = this.remark;

            let detail: any = [];
            this.generics.forEach(v => {
              let obj: any = {};
              obj.generic_id = v.generic_id;
              obj.unit_generic_id = v.unit_generic_id;
              obj.qty = v.qty; // pack
              detail.push(obj);
            });

            let rs: any;
            if (this.borrowNoteId) {
              rs = await this.borrowNoteService.update(this.borrowNoteId, notes, detail);
            } else {
              rs = await this.borrowNoteService.save(notes, detail);
            }
            
            if (rs.ok) {
              this.router.navigate(['/admin/borrow-notes'])
            } else {
              this.alertService.error(rs.error);
            }
          } catch (error) {
            
          }
        }).catch(() => { });
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน')
    }
  }

}

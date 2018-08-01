import { BasicService } from "./../../basic.service";
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-search-people',
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.css']
})
export class SearchPeopleComponent implements OnInit {

  @Input() public peopleId: any;
  @Input() public disabled = false;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  people = [];
  constructor(
    private basicService: BasicService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getPeople();
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.people, { people_id: +event.target.value });
    if (idx > -1) {
      this.onSelect.emit(this.people[idx]);
    }
  }

  async getPeople() {
    try {
      const res = await this.basicService.getPeopleList();
      if (res.ok) {
        this.people = res.rows;
      } else {
        console.log(res.error);
        this.alertService.error();
      }
    } catch (error) {
      this.alertService.error(error.message);
    }

  }

  clearPeople() {
    this.people = [];
  }

}

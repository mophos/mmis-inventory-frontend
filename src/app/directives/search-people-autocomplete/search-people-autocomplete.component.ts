import { BasicService } from "./../../basic.service";
import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-search-people-autocomplete',
  templateUrl: './search-people-autocomplete.component.html'
})
export class SearchPeopleAutoCompleteComponent implements OnInit {
  
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() public peopleId: any;
  @Input() public disabled: boolean;

  token: any;
  query: any = null;
  url: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {
    this.token = sessionStorage.getItem('token');
    this.url = `${this.apiUrl}/basic/search-people-autocomplete?token=${this.token}`;
  }

  ngOnInit() {

  }

  setDefault(value: string) {
    this.query = value;
  }


  onChangeQuery(event: any) {
    if (event) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        this.onChange.emit(false);
      } else {
        this.onChange.emit(true);
      }
    } else {
      this.onChange.emit(false);
    }
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = `${event.title_name}${event.fname} ${event.lname}`;
  }


}

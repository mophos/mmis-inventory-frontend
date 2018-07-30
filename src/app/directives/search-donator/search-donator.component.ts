import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-search-donator',
  templateUrl: './search-donator.component.html',
  styleUrls: []
})
export class SearchDonatorComponent implements OnInit {
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public donatorId: any;
  @Input() public disabled = false;

  donatorName: string;
  token: any;
  query: any = null;
  searchProductUrl: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchProductUrl = `${this.apiUrl}/basic/search-donator?token=${this.token}`;

  }

  ngOnInit() {

  }

  onChangeData() {
    this.onChange.emit(true);
  }

  // setSelected(event) {
  //   try {
  //     this.query = `${event.donator_name}`
  //     this.onSelect.emit(event);
  //   } catch (error) {
  //     //
  //   }
  // }

  setDefault(value: string) {
    this.query = value;
  }

  clearSelected() {
    this.query = null;
  }

  onClearSelected(event: any) {
    if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.onChange.emit(false);
    } else {
      this.onChange.emit(true);
    }
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = event.donator_name;
  }

}

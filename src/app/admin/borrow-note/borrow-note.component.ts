import { Component, OnInit, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { BorrowNoteService } from '../borrow-note.service';
import { AlertService } from 'app/alert.service';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';

@Component({
  selector: 'wm-borrow-note',
  templateUrl: './borrow-note.component.html',
  styles: []
})
export class BorrowNoteComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;
  
  notes: any = [];
  total: number = 0;
  perPage: number = 20;
  query: any = '';

  constructor(
    private alertService: AlertService,
    private borrowNoteService: BorrowNoteService
  ) { }

  ngOnInit() {
    // this.getList(this.perPage, 0);
  }

  async getList(limit: number, offset: number) {
    try {
      this.modalLoading.show();
      let rs: any = await this.borrowNoteService.getList(this.query, limit, offset);
      if (rs.ok) {
        this.notes = rs.rows;
        this.total = rs.total;
      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.getList(limit, offset);
  }

  enterSearch(event: any) {
    if (event.keyCode === 13) {
      if (this.query) {
        this.getList(this.perPage, 0);
      }
    }
  }
}

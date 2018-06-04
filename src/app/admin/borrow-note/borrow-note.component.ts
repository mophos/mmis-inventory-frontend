import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { State } from '@clr/angular';
import { BorrowNoteService } from '../borrow-note.service';
import { AlertService } from 'app/alert.service';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';
import * as _ from "lodash"
@Component({
  selector: 'wm-borrow-note',
  templateUrl: './borrow-note.component.html',
  styles: []
})
export class BorrowNoteComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;
  selectedPrint:any =[]
  notes: any = [];
  total: number = 0;
  perPage: number = 20;
  query: any = '';

  constructor(
    private alertService: AlertService,
    private borrowNoteService: BorrowNoteService,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
    // this.getList(this.perPage, 0);
  }
 async printReport(){
   console.log(this.selectedPrint);
   let borrow_note_id =_.join( _.map(this.selectedPrint,(v)=>{return 'id='+v.borrow_note_id}),'&')
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/borrow-notes/report?token=${token}&`+borrow_note_id;
    this.htmlPreview.showReport(url);
 }
  async getList(limit: number, offset: number) {
    try {
      this.modalLoading.show();
      let rs: any = await this.borrowNoteService.getListAdmin(this.query, limit, offset);
      if (rs.ok) {
        this.notes = rs.rows;
        this.total = rs.total;
        console.log(this.notes);
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
    } else if (this.query === '') {
      this.getList(this.perPage, 0);
    }
  }

  cancelNote(borrowNoteId: any) {
    this.alertService.confirm('ต้องการยกเลิกรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        let rs: any = await this.borrowNoteService.cancelNote(borrowNoteId);
        this.modalLoading.hide();
        if (rs.ok) {
          this.alertService.success();
          this.getList(this.perPage, 0);
        }
      }).catch(() => { });
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { BorrowNoteService } from '../../staff/borrow-note.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-staff-borrow-notes-detail',
  templateUrl: './staff-borrow-notes-detail.component.html'
})
export class StaffBorrowNotesDetailComponent implements OnInit {
  @Input() borrowNoteId: any;
  loading = false;
  generics = [];

  constructor(private borrowNoteService: BorrowNoteService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProductList(this.borrowNoteId);
  }

  async getProductList(borrowNoteId) {
    this.loading = true;
    try {
      const result: any = await this.borrowNoteService.getDetailList(borrowNoteId);
      this.loading = false;
      if (result.ok) {
        this.generics = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}

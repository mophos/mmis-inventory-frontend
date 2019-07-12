import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { State } from '@clr/angular';
import { BorrowNoteService } from '../borrow-note.service';
import { AlertService } from 'app/alert.service';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';
import * as _ from "lodash"
import { JwtHelper } from 'angular2-jwt';
import { BorrowItemsService } from '../borrow-items.service';
@Component({
  selector: 'wm-borrow-note',
  templateUrl: './borrow-note.component.html',
  styles: []
})
export class BorrowNoteComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;
  selectedPrint: any = []
  notes: any = [];
  total = 0;
  perPage = 20;
  query: any = '';
  isOpenModal: boolean = false;
  remainGenerics: any;
  selectedGenerics: any = [];
  warehouses: any;
  dstWarehouse: any;
  borrowDate: any;
  token: any;
  warehouseId: any;
  peopleId: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private borrowItemsService: BorrowItemsService,
    private borrowNoteService: BorrowNoteService,
    private router: Router,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
    const date = new Date();
    this.borrowDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }

    this.token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decoded.warehouseId;
    this.peopleId = decoded.people_id;
  }

  async printReport() {
    const borrow_note_id = _.join(_.map(this.selectedPrint, (v: any) => { return 'id=' + v.borrow_note_id }), '&')
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/borrow-notes/report?token=${token}&` + borrow_note_id;
    this.htmlPreview.showReport(url);
  }
  async getList(limit: number, offset: number) {
    try {
      this.modalLoading.show();
      const rs: any = await this.borrowNoteService.getListAdmin(this.query, limit, offset);
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
    } else if (this.query === '') {
      this.getList(this.perPage, 0);
    }
  }

  cancelNote(borrowNoteId: any) {
    this.alertService.confirm('ต้องการยกเลิกรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        const rs: any = await this.borrowNoteService.cancelNote(borrowNoteId);
        this.modalLoading.hide();
        if (rs.ok) {
          this.alertService.success();
          this.getList(this.perPage, 0);
        }
      }).catch(() => { });
  }

  async openModal() {
    this.isOpenModal = true;
    try {
      const rs: any = await this.borrowNoteService.getWarehouseDst();
      if (rs.ok) {
        this.warehouses = rs.rows;
        this.dstWarehouse = rs.rows[0].warehouse_id
        this.selectedWarehouse();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async selectedWarehouse() {
    try {
      const rs: any = await this.borrowNoteService.getAllgenerics(this.dstWarehouse);
      if (rs.ok) {
        this.remainGenerics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async save() {
    try {
      this.modalLoading.show();
      const summary = {
        borrowDate: `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}`,
        srcWarehouseId: this.warehouseId,
        dstWarehouseId: this.dstWarehouse,
        peopleId: this.peopleId,
        remark: this.selectedGenerics[0].borrow_code
      };

      let group = [];
      for (const v of this.selectedGenerics) {
        let _group = {};
        let idx = _.findIndex(group, { 'genericId': v.generic_id });
        if (idx > -1) {
          group[idx].qty += v.unpaidQty;
        } else {
          _group = {
            wpQty: v.wpQty,
            genericId: v.generic_id,
            qty: v.unpaidQty,
            unit_generic_id: v.unit_generic_id
          }
          group.push(_group);
        }
      }

      let generics = [];
      for (const v of group) {
        if (v.wpQty > v.qty) {
          let data = [];
          const _data = {
            genericId: v.genericId,
            genericQty: v.qty
          }

          data.push(_data);

          let wmRows = [];
          let allocate = await this.borrowItemsService.allocateBorrow(data, this.warehouseId);
          wmRows.push(allocate.rows);

          generics.push({
            generic_id: v.genericId,
            borrow_qty: +v.qty,
            unit_generic_id: v.unit_generic_id,
            // primary_unit_id: v.primary_unit_id,
            products: wmRows
          });
        }
      }

      if (generics.length) {
        const rsT: any = await this.borrowItemsService.saveBorrowFromNote(summary, generics);
        if (rsT.ok) {
          this.alertService.success();
          this.router.navigate(['/admin/borrow']);
        } else {
          this.alertService.error(JSON.stringify(rsT.error));
        }
      } else {
        this.alertService.error('ไม่พบรายการที่ต้องการยืม');
      }
      this.modalLoading.hide();
      console.log(summary, generics)
    } catch (error) {
      this.modalLoading.hide();
    }
  }
}
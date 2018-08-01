import { Component, OnInit, ViewChild } from '@angular/core';
import { State } from "@clr/angular";
import { ReturnBudgetService } from './../return-budget.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-return-budget',
  templateUrl: './return-budget.component.html',
  styles: []
})
export class ReturnBudgetComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  purchases: any = [];
  histories: any = []
  currentPage = 1;
  offset = 0;
  queryPo: any;
  perPage = 20;
  totalPurchases = 0;
  totalHistory = 0;
  queryHistory: any;
  filterStatus = "";

  constructor(
    private returnBudgetService: ReturnBudgetService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  async getPurchasesList(limit: any, offset: any, sort: any, query: any) {
    try {
      this.modalLoading.show();
      const rs: any = await this.returnBudgetService.getPurchasesList(limit, offset, sort, query);
      if (rs.ok) {
        this.purchases = rs.rows;
        this.totalPurchases = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async refreshPo(state: State) {
    this.offset = +state.page.from;
    const limit = +state.page.size;
    const sort = state.sort;

    this.getPurchasesList(limit, this.offset, sort, this.queryPo);
  }

  async getHistoryList(limit: any, offset: any, sort: any, query: any, status: any) {
    try {
      this.modalLoading.show();
      const rs: any = await this.returnBudgetService.getHistoryList(limit, offset, sort, query, status);
      if (rs.ok) {
        this.histories = rs.rows;
        this.totalHistory = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  refreshHistory(state: State) {
    this.offset = +state.page.from;
    const limit = +state.page.size;
    const sort = state.sort;

    this.getHistoryList(limit, this.offset, sort, this.queryHistory, this.filterStatus);
  }

  async notReturnBudget(purchaseId: any) {
    try {
      this.modalLoading.show();
      const rs: any = await this.returnBudgetService.notReturnBudget(purchaseId);
      if (rs.ok) {
        this.getPurchasesList(this.perPage, 0, {}, null);
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  clickNotReturnBudget(purchaseId: any) {
    this.alertService.confirm('คุณไม่ต้องการคืนงบ ใช่หรือไม่?')
      .then(() => {
        this.notReturnBudget(purchaseId);
      })
      .catch(() => { });
  }

  async returnBudget(purchase: any) {
    try {
      this.modalLoading.show();
      const rs: any = await this.returnBudgetService.returnBudget(purchase.purchase_order_id, purchase.differ_price);
      if (rs.ok) {
        this.getPurchasesList(this.perPage, 0, {}, null);
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  clickReturnBudget(purchase: any) {
    this.alertService.confirm(`คุณต้องการคืนงบจำนวน ${purchase.differ_price} บาท ใช่หรือไม่?`)
      .then(() => {
        this.returnBudget(purchase);
      })
      .catch(() => { });
  }

  searchPo(event) {
    if (event.keyCode === 13) {
      this.getPurchasesList(this.perPage, 0, {}, this.queryPo);
    }
  }

  searchHistory(event) {
    if (event.keyCode === 13) {
      this.getHistoryList(this.perPage, 0, {}, this.queryHistory, this.filterStatus);
    }
  }

  changeFilterStatus() {
    this.getHistoryList(this.perPage, 0, {}, this.queryHistory, this.filterStatus);
  }

}

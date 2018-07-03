import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from '../../tools.service';
import { AlertService } from '../../../alert.service';
import { LoadingModalComponent } from '../../../modals/loading-modal/loading-modal.component';
import { constants } from 'os';

@Component({
  selector: 'wm-stockcard',
  templateUrl: './stockcard.component.html',
  styles: []
})
export class StockcardComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;

  perPage = 20;
  items: any = [];
  receives: any = [];
  receiveItems: any = [];
  stockCardItems: any = [];
  stockCardId: any;
  newBalanceQty = 0;
  isOpenSearchReceive = false;
  isOpenReceiveItem = false;
  isOpenStockCardItem = false;

  receiveType: any;
  receiveItemId: any;

  receiveId: any;
  receiveDetailId: any;
  unitGenericId: any;
  newQty: number;

  constructor(
    private toolService: ToolsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  showSearchReceive() {
    this.isOpenSearchReceive = true;
  }

  async doSearchReceives(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchReceives(query);
        if (rs.ok) {
          this.receives = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async getReceiveItems(item: any) {
    try {
      this.modalLoading.show();
      this.receiveType = item.receive_type;
      this.receiveId = item.receive_id;
      // get items list
      const rs: any = await this.toolService.getReceivesItems(item.receive_id, item.receive_type);
      if (rs.ok) {
        this.receiveItems = rs.rows;
        this.isOpenReceiveItem = true;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getStockCardForEdit(item: any) {
    try {
      this.modalLoading.show();
      this.receiveDetailId = this.receiveType === 'PO' ? item.receive_detail_id : item.receive_other_detail_id;
      // get items list
      const rs: any = await this.toolService.getStockForEditCardList(this.receiveId, item.product_id, item.lot_no);
      if (rs.ok) {
        this.stockCardItems = rs.rows;
        this.stockCardId = rs.stockCardId;
        this.isOpenStockCardItem = true;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  editChangeUnit(idx: number, event: any) {
    this.stockCardItems[idx].conversion_qty = event.qty;
    this.stockCardItems[idx].unit_generic_id = event.unit_generic_id;
    this.unitGenericId = event.unit_generic_id;
  }

  changeQty(idx: number, qty: number) {
    this.newQty = qty;
    const _newQty = (+qty * this.stockCardItems[idx].conversion_qty) - +this.stockCardItems[idx].in_qty;
    this.newBalanceQty = _newQty;
    this.stockCardItems[idx].in_qty += _newQty;
    this.calRemain();
  }

  calRemain() {
    this.stockCardItems.forEach((v: any, i: any) => {
      this.stockCardItems[i].balance_qty += this.newBalanceQty;
      this.stockCardItems[i].balance_generic_qty += this.newBalanceQty;
    });
  }

  async saveStockCard() {
    try {
      this.stockCardItems.forEach(v => {
        if (v.stock_card_id === this.stockCardId) {
          this.newQty = v.in_qty / v.conversion_qty;
        }
      });

      this.modalLoading.show();
      // get items list
      const rs: any = await this.toolService.updateStockCard(this.stockCardItems, this.receiveType, this.receiveDetailId, this.newQty, this.unitGenericId);
      if (rs.ok) {
        this.isOpenStockCardItem = false;
        this.isOpenReceiveItem = false;
        this.isOpenSearchReceive = false;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

}

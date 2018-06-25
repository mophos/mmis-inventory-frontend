import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from '../../tools.service';
import { AlertService } from '../../../alert.service';
import { LoadingModalComponent } from '../../../modals/loading-modal/loading-modal.component';

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
  newBalanceQty: number = 0;
  isOpenSearchReceive = false;
  isOpenReceiveItem = false;
  isOpenStockCardItem = false;

  receiveId: any;

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
        let rs: any = await this.toolService.searchReceives(query);
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
      this.receiveId = item.receive_id;
      // get items list
      let rs: any = await this.toolService.getReceivesItems(item.receive_id);
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

  async getStockCardForEdit(productId: any, lotNo: any) {
    try {
      this.modalLoading.show();
      // get items list
      let rs: any = await this.toolService.getStockForEditCardList(this.receiveId, productId, lotNo);
      if (rs.ok) {
        this.stockCardItems = rs.rows;
        this.stockCardId = rs.stockCardId;
        this.isOpenStockCardItem = true;
        console.log(rs);
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
    console.log(event);
  }

  changeQty(idx: number, qty: number) {
    let _newQty = (+qty * this.stockCardItems[idx].conversion_qty) - +this.stockCardItems[idx].in_qty;
    this.newBalanceQty = _newQty;
    console.log(+this.stockCardItems[idx].in_qty, this.newBalanceQty);

    // this.calNewRemain();
  }

  // calNewRemain() {
  //   this.stockCardItems.forEach(v => {
  //     v.balance_qty += this.newBalanceQty;
  //   });
  // }


}

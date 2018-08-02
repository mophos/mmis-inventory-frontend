import { Router } from '@angular/router';
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

  items = [];
  receives = [];
  receiveItems = [];
  requisitions = [];
  stockCardItems = [];
  transfers = [];
  history = [];

  input = false;
  isOpenSearchReceive = false;
  isOpenSearchRequisition = false;
  isOpenSearchTranfer = false;
  modalHistory = false;

  newBalanceQty = 0;
  newQty: number;
  passHis: any;
  perPage = 20;
  receiveType: any;
  receiveItemId: any;
  receiveId: any;
  receiveDetailId: any;
  stockCardId: any;
  unitGenericId: any;

  constructor(
    private toolService: ToolsService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // /////////////////////////////////////

  gotoReceive(receiveId: any, receiveType: any) {
    if (receiveType === 'PO') {
      this.router.navigateByUrl(`/admin/tools/stockcard/receive?receiveId=${receiveId}`);
    } else {
      this.router.navigateByUrl(`/admin/tools/stockcard/receive-other?receiveOtherId=${receiveId}`);
    }
  }

  gotoRequisition(requisitionId: any, confirmId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/requisition?requisitionId=${requisitionId}&confirmId=${confirmId}`);
  }

  gotoTransfer(transferId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/transfer?transferId=${transferId}`);
  }

  showSearchReceive() {
    this.isOpenSearchReceive = true;
  }

  showSearchRequisition() {
    this.isOpenSearchRequisition = true;
  }

  showSearchTranfer() {
    this.isOpenSearchTranfer = true;
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

  async doSearchRequisitions(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        console.log(query);

        const rs: any = await this.toolService.searchRequisitions(query);
        if (rs.ok) {
          this.requisitions = rs.rows;
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

  async doSearchTranfers(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchTranfers(query);
        if (rs.ok) {
          this.transfers = rs.rows;
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

  async openInput() {
    this.input = !this.input;
    if (this.passHis) {
      // this.input = false;
      if (this.passHis === 'admin') {
        try {
          const rs: any = await this.toolService.getHistory();
          if (rs.ok) {
            this.history = rs.rows
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(error);
        }
        this.modalHistory = true;
      }
    }
    this.passHis = null;

  }
}

import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from '../../tools.service';
import { AlertService } from '../../../alert.service';
import { LoadingModalComponent } from '../../../modals/loading-modal/loading-modal.component';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-stockcard',
  templateUrl: './stockcard.component.html',
  styles: []
})
export class StockcardComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;

  receives = [];
  requisitions = [];
  borrows = [];
  transfers = [];
  history = [];
  issues = [];

  input = false;
  isOpenSearchReceive = false;
  isOpenSearchRequisition = false;
  isOpenSearchBorrow = false;
  isOpenSearchTranfer = false;
  isOpenSearchIssue = false;
  modalHistory = false;
  passwordModal = false;
  checkEnterPass = true;
  showBtnCal = false;
  removeStockcardModal = false;
  calBalanceUnitCostModal = false;
  calBalanceLotModal = false;

  token: any;
  warehouseId: any;
  passHis: any;
  passwordRemovestockcard: any = '';
  passwordcalBalanceUnitCost: any = '';
  passwordcalBalanceLot: any = '';
  isOpenSearchPick: boolean;
  picks: any;
  password: any;
  isSaving = false;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private toolService: ToolsService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

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

  gotoBorrow(borrowId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/borrow?borrowId=${borrowId}`);
  }

  gotoTransfer(transferId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/transfer?transferId=${transferId}`);
  }

  gotoIssue(issueId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/issue?issueId=${issueId}`);
  }

  gotoPick(pickId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/pick?pickId=${pickId}`);
  }


  showSearchReceive() {
    this.isOpenSearchReceive = true;
  }

  showSearchRequisition() {
    this.isOpenSearchRequisition = true;
  }

  showSearchBorrow() {
    this.isOpenSearchBorrow = true;
  }

  showSearchTranfer() {
    this.isOpenSearchTranfer = true;
  }

  showSearchIssue() {
    this.isOpenSearchIssue = true;
  }

  showSearchPick() {
    this.isOpenSearchPick = true;
  }

  showModalCal() {
    this.passwordModal = true;
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

  async doSearchBorrows(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        console.log(query);

        const rs: any = await this.toolService.searchBorrows(query);
        if (rs.ok) {
          this.borrows = rs.rows;
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

  async doSearchIssues(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchIssues(query);
        if (rs.ok) {
          this.issues = rs.rows;
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

  async doSearchPick(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchPick(query);
        if (rs.ok) {
          this.picks = rs.rows;
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
      } else if (this.passHis === 'cal') {
        this.showBtnCal = true;
      } else if (this.passHis === 'removestockcard') {
        this.removeStockcardModal = true;
      } else if (this.passHis === 'calunitcost') {
        this.calBalanceUnitCostModal = true;
      } else if (this.passHis === 'callot') {
        this.calBalanceLotModal = true;
      }
    }
    this.passHis = null;

  }

  enterCalStockCard(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.calStockCard();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }

  async calStockCard() {
    try {
      this.isSaving = true;
      this.modalLoading.show();
      const rs: any = this.toolService.calStockCard(this.warehouseId);
      this.modalLoading.hide();
      this.passwordModal = false;
      this.alertService.success('ระบบกำลังประมวลผลอยู่พื้นหลัง อาจใช้เวลา 5 - 20 นาที');
      this.isSaving = false;
      // if (rs.ok) {
      // } else {
      //   this.alertService.error(rs.error);
      // }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error))
    }
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

  async removestockcard() {

    try {
      const rs: any = await this.toolService.checkPassword(this.passwordRemovestockcard);
      if (rs.ok) {
        try {
          this.modalLoading.show();
          const rs: any = this.toolService.removestockcard(this.warehouseId);
          this.modalLoading.hide();
          this.alertService.success('ระบบกำลังประมวลผลอยู่พื้นหลัง อาจใช้เวลา 30 - 60 นาที');
          this.removeStockcardModal = false;
          // if (rs.ok) {
          //   this.removeStockcardModal = false;
          // } else {
          //   this.alertService.error(rs.error);
          // }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error))
        }
      } else {
        this.alertService.error(rs.error.message);
      }
    } catch (error) {
      this.alertService.error('รหัสไม่ถูกต้อง')
    }
  }

  async calBalanceUnitCost() {
    try {
      const rs: any = await this.toolService.checkPassword(this.passwordcalBalanceUnitCost);
      if (rs.ok) {
        try {
          this.modalLoading.show();
          const rs: any = this.toolService.calbalanceunitcost(this.warehouseId, this.token);
          this.modalLoading.hide();
          this.alertService.success('ระบบกำลังประมวลผลอยู่พื้นหลัง อาจใช้เวลา 30 - 60 นาที');
          this.calBalanceUnitCostModal = false;
          // if (rs.ok) {
          //   this.removeStockcardModal = false;
          // } else {
          //   this.alertService.error(rs.error.message);
          // }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error))
        }
      } else {
        this.alertService.error(rs.error.message);
      }
    } catch (error) {
      this.alertService.error('รหัสไม่ถูกต้อง')
    }
  }

  async calBalanceLot() {
    try {
      const rs: any = await this.toolService.checkPassword(this.passwordcalBalanceLot);
      if (rs.ok) {
        try {
          this.modalLoading.show();
          const rs: any = this.toolService.calbalancelot(this.warehouseId, this.token);
          this.modalLoading.hide();
          this.alertService.success('ระบบกำลังประมวลผลอยู่พื้นหลัง อาจใช้เวลา 30 - 60 นาที');
          this.calBalanceLotModal = false;
          // if (rs.ok) {
          //   this.removeStockcardModal = false;
          // } else {
          //   this.alertService.error(rs.error.message);
          // }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error))
        }
      } else {
        this.alertService.error(rs.error.message);
      }
    } catch (error) {
      this.alertService.error('รหัสไม่ถูกต้อง')
    }
  }


}

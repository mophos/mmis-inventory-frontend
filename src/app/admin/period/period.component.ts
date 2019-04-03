import { AlertService } from 'app/alert.service';
import { MonthDateperiodPipe } from 'app/helper/month-dateperiod.pipe';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PeriodService } from '../../period.service';
import { MonthToThPipe } from 'app/helper/month-to-th.pipe';
import { YearThaiPipe } from 'app/helper/year-thai.pipe';
import * as _ from 'lodash';
import { log } from 'util';

@Component({
  selector: 'wm-period',
  templateUrl: './period.component.html',
  styles: []
})
export class PeriodComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading;

  users: any = [];
  po: any = [];
  receive: any = [];
  receiveOther: any = [];
  requisition: any = [];
  issue: any = [];
  transfer: any = [];
  budget_year: any = [];
  basic = false;
  show = false;

  period: any;
  selectedUser: any;
  status: any;
  date: any;

  budget_select: any;

  constructor(private periodService: PeriodService,
    private monthToThPipe: MonthToThPipe,
    private monthDateperiodPipe: MonthDateperiodPipe,
    private alertService: AlertService,
    private yearThaiPipe: YearThaiPipe) { }

  ngOnInit() {
    this.getPeriod();
    this.date = this.periodService.getdate();
  }
  async getDetail() {
    try {
      this.modalLoading.show();
      const rs = await this.periodService.getYear(this.period);
      if (rs.ok) {
        this.users = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async selectYear() {
    const rs = await this.periodService.selectYear();
    this.budget_year = rs.rows;
  }
  async getPeriod() {
    this.period = await this.periodService.getPeriod();
    this.budget_select = this.period;
    this.selectYear();
    this.getDetail();
  }
  click() {
    this.basic = true;
    this.status = this.selectedUser.status;
  }
  change(e) {
    this.period = e;
    this.getDetail();

  }
  async getStartDate(idx: any) {
    const m = this.users[idx].period_month;
    const d = await this.periodService.getenddate(m);
    const y = this.users[idx].period_year;
    const startdate = y + '-' + m + '-01';
    return startdate;
  }
  async getEndDate(idx: any) {
    const m = this.users[idx].period_month;
    const d = await this.periodService.getenddate(m);
    const y = this.users[idx].period_year;
    const enddate = y + '-' + m + '-' + d;
    return enddate;
  }
  async close(idx: any, period_id: any) {
    try {
      this.modalLoading.show();
      const startdate = await this.getStartDate(idx);
      const enddate = await this.getEndDate(idx);
      const po = await this.periodService.getPo(startdate, enddate);
      const receive = await this.periodService.getReceive(startdate, enddate);
      const receiveOther = await this.periodService.getReceiveOther(startdate, enddate);
      const requisition = await this.periodService.getRequisition(startdate, enddate);
      const issue = await this.periodService.getIssue(startdate, enddate);
      const transfer = await this.periodService.getTransfer(startdate, enddate);
      if (!po.ok || !receive.ok || !receiveOther.ok || !issue.ok || !transfer.ok) {
        this.alertService.error("ระบบมีการทำงานผิดพลาด กรุณาติดต่อผู้ดูแลระบบ");
      } else {
        this.po = po.rows;
        this.receive = receive.rows;
        this.receiveOther = receiveOther.rows;
        this.requisition = requisition.rows;
        this.issue = issue.rows;
        this.transfer = transfer.rows;
        if ((po.ok && po.rows.length) || (receive.ok && receive.rows.length)
          || (receiveOther.ok && receiveOther.rows.length)
          || (issue.ok && issue.rows.length)
          || (transfer.ok && transfer.rows.length)
          || (requisition.ok && requisition.rows.length)) {
          this.modalLoading.hide();
          this.show = true;
          this.users[idx].status = 'open';
          this.status = 'open';
        } else {
          await this.updateCloseDate(period_id, this.date);
        }
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async switchStatus(event, period_id) {
    this.status = event.target.checked ? 'open' : 'close';
    const idx = _.findIndex(this.users, { period_id: period_id });
    this.users[idx].status = event.target.checked ? 'open' : 'close';

    if (this.status === "open") {
      await this.updateOpenDate(period_id);
    } else {
      await this.close(idx, period_id);
    }
  }

  async updateCloseDate(id, date) {
    const result = await this.periodService.updateCloseDate(id, date);
    // .then(async (result: any) => {
    if (result.ok) {
      const idx = _.findIndex(this.users, { period_id: id });
      await this.log(id,
        this.users[idx].budget_year,
        this.users[idx].period_year,
        this.users[idx].period_month,
        this.users[idx].status);
      await this.getDetail();
    } else {
      this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
    }

    // });
  }
  async updateOpenDate(id) {
    try {
      this.modalLoading.show();
      const result = await this.periodService.updateOpenDate(id);
      if (result.ok) {
        const idx = _.findIndex(this.users, { period_id: id });
        this.log(id,
          this.users[idx].budget_year,
          this.users[idx].period_year,
          this.users[idx].period_month,
          this.users[idx].status);
        await this.getDetail();
      } else {
        this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
      }
      // this.periodService.updateOpenDate(id)
      //   .then(async (result: any) => {
      //     if (result.ok) {
      //       const idx = _.findIndex(this.users, { period_id: id });
      //       this.log(id,
      //         this.users[idx].budget_year,
      //         this.users[idx].period_year,
      //         this.users[idx].period_month,
      //         this.users[idx].status);
      //       await this.getDetail();
      //     } else {
      //       this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
      //     }
      //     // this.modalLoading.hide();
      //   });
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async log(period_id: any, budget_year: any, period_year: any, period_month: any,
    period_status: any) {
    const date = this.periodService.getdate();

    await this.periodService.log(period_id, budget_year, period_year, period_month, period_status, date);
  }
  finalclose(id, status) {
    if (status === 'close') {
      try {
        this.modalLoading.show();
        this.periodService.finalclose(id)
          .then(async (result: any) => {
            if (result.ok) {
              const idx = _.findIndex(this.users, { period_id: id });
              this.log(id,
                this.users[idx].budget_year,
                this.users[idx].period_year,
                this.users[idx].period_month,
                'final_close');
              await this.getDetail();
            } else {
              this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
            }
            this.modalLoading.hide();
          });
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
    } else {
      this.alertService.error('กรุณาเปลี่ยนสถานะเป็น close ก่อน');
    }
  }
}

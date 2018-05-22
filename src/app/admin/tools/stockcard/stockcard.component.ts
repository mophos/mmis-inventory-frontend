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
  isOpenSearchReceive = false;
  isOpenReceiveItem = false;

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


}

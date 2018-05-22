import { Component, OnInit } from '@angular/core';
import { ToolsService } from '../../tools.service';
import { AlertService } from '../../../alert.service';

@Component({
  selector: 'wm-stockcard',
  templateUrl: './stockcard.component.html',
  styles: []
})
export class StockcardComponent implements OnInit {

  perPage = 20;
  items: any = [];
  receives: any = [];
  isOpenSearchReceive = false;

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
        let rs: any = await this.toolService.searchReceives(query);
        if (rs.ok) {
          this.receives = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

}

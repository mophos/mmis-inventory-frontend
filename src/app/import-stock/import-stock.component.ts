import { Component, OnInit, NgZone } from '@angular/core';
import { WarehouseService } from '../admin/warehouse.service';
import * as _ from 'lodash';
@Component({
  selector: 'wm-import-stock',
  templateUrl: './import-stock.component.html',
  styleUrls: ['./import-stock.component.css']
})
export class ImportStockComponent implements OnInit {

  wareHouse: any = [];
  wareHouseSelect: any;
  datagrid = false;
  importList = [];
  productList = [];
  temp = [];
  temp2 = [];
  constructor(private warehouseService: WarehouseService,
    private zone: NgZone) { }

  ngOnInit() {
    this.getWarehouse();
  }

  async getWarehouse() {
    const rs: any = await this.warehouseService.getWarehouse();
    this.wareHouse = rs.rows;
  }
  async openData(e) {
    let t = [];
    console.log(e.target.value);
    const rs: any = await this.warehouseService.getWarehouseProductImport(e.target.value);
    if (rs.ok) {
      this.importList = rs.rows;

      await this.importList.forEach(async v => {
        const rs2: any = await this.warehouseService.getProductImport(v.working_code);
        if (rs2.ok) {
          // let idx = _.findIndex(this.importList, { generic_id: v.working_code });
          // if (idx > -1) {
          //   this.importList[idx].product = rs2.rows
          // }
          await rs2.rows.forEach(async i => {
            await t.push(i);

          });
        }
      });
      
      console.log(t);
      
      await this.importList.forEach(async (j, i) => {
        this.importList[i].product = [];
        await t.forEach(v => {
          // console.log(j.generic_id, v.working_code);
          if (j.generic_id === v.working_code) {

            this.zone.run(() => {
              this.importList[i].product.push(v);
            });
          }
        });

      });

      console.log(this.importList);
      // console.log(this.temp);


      this.datagrid = true;
    }


  }


}

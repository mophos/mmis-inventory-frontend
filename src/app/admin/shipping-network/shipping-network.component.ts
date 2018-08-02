import { Component, OnInit, ViewChild } from '@angular/core';
import { BasicService } from '../../basic.service';
import { AlertService } from '../../alert.service';
import { ShippingNetworkService } from '../shipping-network.service';

import * as _ from 'lodash';
import { forEach } from '@angular/router/src/utils/collection';
import { log } from 'util';
import { async } from '@angular/core/testing';

@Component({
  selector: 'wm-shipping-network',
  templateUrl: './shipping-network.component.html',
  styleUrls: ['./shipping-network.component.css']
})
export class ShippingNetworkComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  warehouses = [];
  wh = [];
  whs = [];
  netId: any = [];
  networkTypes = [];
  transferTypeCode: any;
  isActive = true;
  dstWarehouseId: any;
  srcWarehouseId: any;
  isTwoways = false;
  isOpenModal = false;
  _isOpenModal = false;
  shipNetworkId: any

  inventory: any = []
  inventory1: any = []
  selectNetwork: any = []

  networkId: any;
  isUpdate = false;
  networks: any = [];
  query:any
  constructor(
    private basicService: BasicService,
    private alertService: AlertService,
    private shipNetwork: ShippingNetworkService,
  ) { }

  ngOnInit() {
    this.getNetworkTypes();
    this.getWarehouses();
    this.getList();
  }
  search(even:any){
    if (even.keyCode === 13) {
      if (this.query) {
        this.getSearchList();
      } else {
        this.getList();
      }
    } else if (this.query === '') {
      this.getList();
    }
    
  }
  async getSearchList() {
    this.modalLoading.show();
    try {
      // this.networks = [];
      const res = await this.shipNetwork.getSearchList(this.query);
      if (res.ok) {
        this.networks = res.rows;
      } else {
        this.alertService.error(res.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getNetworkTypes() {
    try {
      const res: any = await this.basicService.getNetworkTypes();
      if (res.ok) {
        this.networkTypes = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
  async getWarehouses() {
    try {
      const res: any = await this.basicService.getWarehouses();
      if (res.ok) {
        this.wh = res.rows;
        this.whs = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  onSelectSource(event) {
    this.srcWarehouseId = event.warehouse_id;
  }

  onSelectDestination(event) {
    this.dstWarehouseId = event.warehouse_id;
  }

  clearForm() {
    this.isActive = true;
    this.inventory = [];
    this.inventory1 = [];
    this.selectNetwork = [];
    this.isUpdate = false;
    this.netId = [];
    this.isTwoways = false;

    this.networks.forEach((v: any, i: any) => {
      this.networks[i].is_update = 'N';
    })
  }

  async getList() {
    this.modalLoading.show();
    try {
      // this.networks = [];
      const res = await this.shipNetwork.getList();
      if (res.ok) {
        this.networks = res.rows;
      } else {
        this.alertService.error(res.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async saveNetwork() {
    this.isOpenModal = false;
    try {
      this.modalLoading.show();
      const isActive = this.isActive ? 'Y' : 'N';
      const isTwoways = this.isTwoways ? 'Y' : 'N';
      let res;
      if (this.isUpdate) {
        res = await this.shipNetwork.updateNetwork(this.shipNetworkId, this.srcWarehouseId, this.dstWarehouseId, this.transferTypeCode)
        if (res.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('รายการซ้ำ กรุณาตรวจสอบ');
        }
      } else {
        await this.inventory.forEach(async (v) => {
          await this.selectNetwork.forEach(async (e) => {
            await this.inventory1.forEach(async (n) => {
              res = await this.shipNetwork.saveNetwork(v.warehouse_id, n.warehouse_id, e.transfer_code, isActive)
              if (isTwoways === 'Y') {
                if (e.transfer_code === 'REQ') {
                  res = await this.shipNetwork.saveNetwork(n.warehouse_id, v.warehouse_id, 'ISS', isActive)
                } else {
                  res = await this.shipNetwork.saveNetwork(n.warehouse_id, v.warehouse_id, e.transfer_code, isActive)
                }
              }
              await this.getList();
            });
          });
        });
      }
      this.getList();
      this.clearForm();
      this.isUpdate = false;
      this.isOpenModal = false;
      this._isOpenModal = false;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error('เกิดข้อผิดพลาด : ' + error.message);
    }
  }

  removeNetwork(networkId: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.shipNetwork.removeNetwork(networkId)
          .then((res: any) => {
            if (res.ok) {
              this.alertService.success();
              this.getList();
            } else {
              this.alertService.error(res.error);
            }
            this.modalLoading.hide();
          }).catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          });
      }).catch(() => { });
  }

  async setEdit(network: any) {
    this.clearForm()
    const res = await this.shipNetwork.getListEdit(network.shipping_network_id)
    this.transferTypeCode = res.rows ? res.rows[0].transfer_code : null;
    this.srcWarehouseId = res.rows ? res.rows[0].src_warehouseId : null;
    this.dstWarehouseId = res.rows ? res.rows[0].dst_warehouseId : null;
    this.shipNetworkId = res.rows ? res.rows[0].shipping_network_id : null;
    this.isUpdate = true
    this._isOpenModal = true;
  }

  setisActive(active: any, shipping_network_id: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.modalLoading.show();
    this.shipNetwork.isActive(shipping_network_id, status)
      .then((result: any) => {
        if (result.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }
  openModal() {
    this.isOpenModal = true;
  }
}

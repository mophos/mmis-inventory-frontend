import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WarehouseService } from '../warehouse.service';
import { ProductsService } from '../products.service';
import { Router } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from "../../alert.service";

import * as _ from 'lodash';

@Component({
  selector: 'wm-warehouse-products',
  templateUrl: './warehouse-products.component.html',
  styleUrls: ['./warehouse-products.component.css']
})
export class WarehouseProductsComponent implements OnInit {

  isRequest = false;
  isSaving = false;
  warehouses = [];
  warehouseId: any;

  public mask = [/\d/, /\d/, /\d/];

  allProducts = [];
  products = [];
  query: string;
  loading = false;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };

  requestDate: any;

  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private productService: ProductsService,
    private warehouseService: WarehouseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllProducts();
  }

    getAllProducts() {
    this.loading = true;
    this.warehouses = [];
    this.warehouseService.getWarehouseProduct()
      .then((results: any) => {
        if (results.ok) {
          this.warehouses = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
        this.loading = false;
        this.ref.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

}

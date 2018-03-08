import { ReportProductsService } from './../reports-products.service';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject
} from '@angular/core';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-product-remain',
  templateUrl: './product-remain.component.html',
  styleUrls: ['./product-remain.component.css']
})
export class ProductRemainComponent implements OnInit {
  products: any = [];
  allWarehouseProducts = [];
  warehouses: any = [];
  warehouseId: number;
  openGraph = false;
  openAllWarehouse = false;
  loading = false;
  loadingAll = false;
  productId: string;
  demoOption: any;
  chartOptions: any;
  token: string;

  constructor(
    private warehouseService: WarehouseService,
    private reportProductService: ReportProductsService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private url: string
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.getWarehouseList();
  }

  getRemain() {
    this.loading = false;
    this.products = [];
    this.reportProductService.getProductRemain(this.warehouseId)
      .then((result: any) => {
        this.loading = false;
        this.products = result.rows;
        this.setChartData();
        this.ref.detectChanges();
      })
      .catch(error => {
        this.loading = false;
        this.alertService.error(error.message);
      });
  }

  getRemainAllWarehouse(product) {
    this.allWarehouseProducts = [];
    this.reportProductService.getProductRemainAllWarehouse(product.product_id)
      .then((result: any) => {
        if (result.ok) {
          this.allWarehouseProducts = result.rows;
          this.openAllWarehouse = true;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      })
      .catch(error => {
        this.alertService.serverError();
      });
  }

  setChartData() {
    const chartData = [];
    const categories = [];

    const _products = _.orderBy(this.products, ['total'], ['desc']);
    _.forEach(_products, (v: any) => {
      categories.push(v.product_name);
      chartData.push(v.total);
    });

    console.log(_products);

    this.demoOption = {
      chart: {
        type: 'column'
      },
      title: { text: 'สถิติการรับสินค้าเข้าคลัง' },
      xAxis: {
        categories: categories
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: false
        }
      },
      series: [{
        name: 'ปริมาณการรับเข้า',
        data: chartData,
      }]
    }
  }

  getWarehouseList() {
    this.warehouseService.all()
      .then((result: any) => {
        if (result.ok) {
          this.warehouses = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      });
  }

  pdfExport() {
    if (this.warehouseId) {
      const url = `${this.url}/reports/products/remain/pdf/${this.warehouseId}?token=${this.token}`;
      window.open(url);
    } else {
      this.alertService.error('กรุณาระบุคลังสินค้า');
    }
  }

  excelExport() {
    if (this.warehouseId) {
      const url = `${this.url}/reports/products/remain/excel/${this.warehouseId}?token=${this.token}`;
      window.open(url);
    } else {
      this.alertService.error('กรุณาระบุคลังสินค้า');
    }
  }

  showGraph(productId: string) {
    this.productId = productId;

    this.reportProductService.getProductReceives(productId)
      .then((result: any) => {
        const categories = [];
        const _data = [];
        const rows = <Array<any>>result.rows;
        rows.forEach(v => {
          const date = `${moment(v.receive_date).format('DD/MM')}/${moment(v.receive_date).get('year') + 543}`;
          categories.push(date);
          _data.push(+v.total);
        });

        this.chartOptions = {
          title: { text: 'สถิติการรับสินค้าเข้าคลัง' },
          xAxis: {
            categories: categories
          },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: false
            }
          },
          series: [{
            name: 'ปริมาณการรับเข้า',
            data: _data,
          }]
        };

        this.openGraph = true;
      });
  }
}

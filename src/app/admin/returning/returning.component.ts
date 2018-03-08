import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BorrowService } from '../borrow.service';
import { AlertService } from '../../alert.service';
import { ToThaiDatePipe } from '../../helper/to-thai-date.pipe';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-returning',
  templateUrl: './returning.component.html',
  styleUrls: ['./returning.component.css']
})
export class ReturningComponent implements OnInit {

  loading = false;
  remainQty = 0;

  borrowId: string;
  borrowTypeName: string;
  borrowDate: string;
  borrowWarehouseName: string;
  borrowWarehouseId: string;
  ownerWarehouseName: string;
  ownerWarehouseId: string;
  dueReturnDate: string;
  dueReturnDay: string;

  openBorrowQty = false;
  openBorrowEditQty = false;
  products: any[] = [];
  checkedProducts: any[] = [];
  productSearches: any[] = [];
  warehouses: any[] = [];
  loadingProducts = false;

  selProductName: string;
  returnQty = 0;

  selectedProducts: any[] = [];
  selectedProduct: any = {};
  productLots: any[] = [];

  selectedProductId: string;

  isSaving = false;
  timer: any;
  isSearching = false;
  totalProduct = 0;
  totalCost = 0;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  returnDate: any;
  // warehouseId: string;

  constructor(
    private alertService: AlertService,
    private borrowService: BorrowService,
    private route: ActivatedRoute,
    private toThaiDate: ToThaiDatePipe,
    private router: Router
  ) {
    this.borrowId = this.route.snapshot.params['borrowId'];
  }

  ngOnInit() {
    // this.getWarehouseList();
    const date = new Date();
    this.returnDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.getSummaryDetail();
  }

  getSummaryDetail() {
    this.borrowService.getSummaryDetailForCheck(this.borrowId)
      .then((result: any) => {
        if (result.ok) {
          this.borrowTypeName = result.rows.borrow_type_name;
          this.borrowDate = this.toThaiDate.transform(result.rows.borrow_date);
          this.borrowWarehouseName = result.rows.borrow_warehouse_name;
          this.ownerWarehouseName = result.rows.owner_warehouse_name;
          this.ownerWarehouseId = result.rows.owner_warehouse_id;
          this.borrowWarehouseId = result.rows.borrow_warehouse_id;
          this.dueReturnDate = this.toThaiDate.transform(result.rows.due_return_date);
          this.dueReturnDay = result.rows.due_return_day;

          this.getProductWharehouse();
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      })
      .catch(error => {
        this.alertService.error(JSON.stringify(error));
      });
  }

  // getWarehouseList() {
  //   this.borrowService.getWherehouseList()
  //     .then((result: any) => {
  //       this.warehouses = result.rows;
  //       // this.warehouseId = this.ownerWarehouseId;
  //     })
  //     .catch((e) => {
  //       console.log(e);
  //       this.alertService.error(JSON.stringify(e));
  //     });
  // }

  showConfirmReturn(p) {
    this.openBorrowQty = true;
    this.borrowService.getProductForReturn(p.product_id, this.borrowWarehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.productLots = result.rows;
          this.selectedProduct = p;
          this.returnQty = 0;
          this.selProductName = p.product_name;
          this.selectedProductId = null;
        } else {
          this.alertService.error('ไม่สามารถดูรายละเอียดของ Lots ได้');
        }
      })
      .catch(() => {
        this.alertService.error();
      });
  }

  changeLot() {
    const idxLot = _.findIndex(this.productLots, { id: this.selectedProductId });
    if (idxLot > -1) {
      this.remainQty = this.productLots[idxLot].qty;
    }
  }

  doAddProduct() {
    try {
      if (this.returnQty > 0) {
        const idx = _.findIndex(this.selectedProducts, { id: this.selectedProduct.id });
        if (idx > -1) {
          this.selectedProducts[idx].return_qty += +this.returnQty;
        } else {
          const idxLot = _.findIndex(this.productLots, { id: this.selectedProductId });
          if (idxLot > -1) {
            if (this.returnQty <= this.productLots[idxLot].qty) {
              const obj: any = {
                id: this.productLots[idxLot].id,
                lot_no: this.productLots[idxLot].lot_no,
                return_qty: +this.returnQty,
                product_id: this.productLots[idxLot].product_id,
                product_name: this.selectedProduct.product_name,
                large_unit: this.productLots[idxLot].large_unit,
                large_qty: this.productLots[idxLot].large_qty,
                small_qty: this.productLots[idxLot].small_qty,
                small_unit: this.productLots[idxLot].small_unit,
                cost: this.productLots[idxLot].cost,
                package_id: this.productLots[idxLot].package_id
              };
              this.selectedProducts.push(obj);
              // close modal
              this.openBorrowQty = false;
              this.countTotal();
            } else {
              this.alertService.error(`
              ไม่สามารถดำเนินการได้ เนื่องจากจำนวนที่ต้องการคืน มากกว่าจำนวนคงเหลือ
              (คงเหลือ ${this.productLots[idxLot].qty})
              `);
            }
          }
        }
      } else {
        this.alertService.error('กรุณาระบุจำนวนที่ต้องการคืน');
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  countTotal() {
    this.totalCost = 0;
    this.totalProduct = 0;
    this.selectedProducts.forEach(v => {
      this.totalCost += +v.cost * +v.return_qty;
      this.totalProduct += +v.return_qty;
    });
  }

  removeReturnQty(idx) {
    this.alertService.confirm('คุณต้องการลบรายการ ใช่หรือไม่?')
      .then(() => {
        this.selectedProducts.splice(idx, 1);
        this.countTotal();
      })
      .catch(() => { });
  }

  doSave() {
    if (this.ownerWarehouseId && this.returnDate && this.selectedProducts.length) {
      const date = `${this.returnDate.date.year}-${this.returnDate.month}-${this.returnDate.day}`;
      const summary = {
        returnDate: date,
        warehouseId: this.ownerWarehouseId,
        borrowId: this.borrowId
      };

      const items = [];
      this.selectedProducts.forEach(v => {
        items.push({
          id: v.id,
          productId: v.product_id,
          returnQty: v.return_qty,
        });
      });

      this.alertService.confirm('คุณต้องการบันทึกรับคืนสินค้า ใช่หรือไม่?')
        .then(() => {
          this.borrowService.saveReturn(items, summary)
            .then((result: any) => {
              if (result.ok) {
                this.alertService.success();
                this.router.navigate(['/admin/borrow']);
              } else {
                this.alertService.error(JSON.stringify(result.error));
              }
            })
            .catch((error) => {
              this.alertService.error(error.message);
            });
        })
        .catch(() => { });
    } else {
      this.alertService.error('กรุณาระบุรายการให้ครบถ้วน');
    }
  }

  getProductWharehouse() {
    this.loading = true;
    this.products = [];
    this.borrowService.getProductsInWarehouse(this.borrowWarehouseId)
      .then((resp: any) => {
        if (resp.ok) {
          this.products = resp.rows;
        } else {
          this.alertService.error(JSON.stringify(resp.error));
        }
        this.loading = false;
      })
      .catch((error: any) => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

}

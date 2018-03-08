import { AlertService } from 'app/alert.service';
import { StaffService } from 'app/staff/staff.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'wm-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  genericTypes = [];
  genericType: any;
  products = [];
  query: any;
  _genericTypes: any = [];
  _genericType: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;

  constructor(
    private staffService: StaffService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string,
  ) { }

  ngOnInit() {
    this.getGenericType();
  }
  async getGenericType() {
    try {
      const rs = await this.staffService.getGenericType();

      if (rs.ok) {
        this.genericTypes = rs.rows;
        this._genericTypes = [];
        this.genericTypes.forEach((e: any) => {
          this._genericTypes.push(e.generic_type_id)
        });
        this.genericType = '';
        this.getProducts();
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }
  async getProducts(query: any = '') {
    try {
      if (this.genericType === '') {
        this._genericType = this._genericTypes;
      } else {
        this._genericType = [];
        this._genericType.push(this.genericType)
      }
      console.log(this._genericType);
      this.modalLoading.show();
      const rs = await this.staffService.getProductAll(query, this._genericType);

      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.getProducts(e.target.value);
    }
  }
  showPrint() {
    const types = [];
    this._genericType.forEach(e => {
      types.push('genericTypeId=' + e);
    });
    const url = this.apiUrl + '/report/product/all?' + types.join('&');
    this.htmlPreview.showReport(url);
  }
  outExcel(){
    const types = [];
    this._genericType.forEach(e => {
      types.push('genericTypeId=' + e);
    });
    const token = sessionStorage.getItem('token');
    const exportUrl = `${this.apiUrl}/report/product/all/excel?token=${token}&` + types.join('&');;
    window.open(exportUrl);

  }
}

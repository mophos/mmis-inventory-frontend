import { AlertService } from 'app/alert.service';
import { StaffService } from 'app/staff/staff.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

@Component({
  selector: 'wm-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products = [];
  query: any = '';
  token: any;
  genericType: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('genericMulti') public genericMulti: any;

  constructor(
    private staffService: StaffService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string,
  ) {
    this.token = sessionStorage.getItem('token')
  }

  async ngOnInit() {
    this.genericType = this.genericMulti.getDefaultGenericType()
    await this.getProducts();
  }

  selectGenericTypeMulti(e) {
    this.genericType = e;
    this.getProducts()
  }

  async getProducts() {
    try {
      this.modalLoading.show();
      const rs = await this.staffService.getProductAll(this.query, this.genericType);

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
      this.getProducts();
    }
  }

  showPrint() {
    let genericTypeLV1: any;
    let genericTypeLV2: any;
    let genericTypeLV3: any;
    if (this.genericType.generic_type_lv1_id.length) {
      genericTypeLV1 = this.genericType.generic_type_lv1_id.join(',')
    }
    if (this.genericType.generic_type_lv2_id.length) {
      genericTypeLV2 = this.genericType.generic_type_lv2_id.join(',')
    }
    if (this.genericType.generic_type_lv3_id.length) {
      genericTypeLV3 = this.genericType.generic_type_lv3_id.join(',')
    }
    const url = this.apiUrl + `/report/product/all?token=${this.token}&query=${this.query}&genericTypeLV1Id=${genericTypeLV1}&genericTypeLV2Id=${genericTypeLV2}&genericTypeLV3Id=${genericTypeLV3}`;
    this.htmlPreview.showReport(url);
  }

  outExcel() {
    let genericTypeLV1: any;
    let genericTypeLV2: any;
    let genericTypeLV3: any;
    if (this.genericType.generic_type_lv1_id.length) {
      genericTypeLV1 = this.genericType.generic_type_lv1_id.join(',')
    }
    if (this.genericType.generic_type_lv2_id.length) {
      genericTypeLV2 = this.genericType.generic_type_lv2_id.join(',')
    }
    if (this.genericType.generic_type_lv3_id.length) {
      genericTypeLV3 = this.genericType.generic_type_lv3_id.join(',')
    }
    const exportUrl = `${this.apiUrl}/report/product/all/excel?token=${this.token}&query=${this.query}&genericTypeLV1Id=${genericTypeLV1}&genericTypeLV2Id=${genericTypeLV2}&genericTypeLV3Id=${genericTypeLV3}`;
    window.open(exportUrl);

  }
}

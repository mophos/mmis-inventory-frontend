import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';

@Component({
  selector: 'wm-requisition-confirm-edit',
  templateUrl: './requisition-confirm-edit.component.html',
  styles: []
})
export class RequisitionConfirmEditComponent implements OnInit {
  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;

  products: any = [];

  constructor() { }

  ngOnInit() {
  }

}

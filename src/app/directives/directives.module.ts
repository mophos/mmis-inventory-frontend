import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SelectLotsComponent } from './select-lots/select-lots.component';
import { SelectUnitsComponent } from './select-units/select-units.component';
import { SelectVendorComponent } from './select-vendor/select-vendor.component';

import { BasicService } from '../basic.service';
import { SelectReceiveLotsComponent } from './select-receive-lots/select-receive-lots.component';
import { SelectProductWarehouseComponent } from './select-product-warehouse/select-product-warehouse.component';
import { SelectProductLocationComponent } from './select-product-location/select-product-location.component';
import { SelectManufactureComponent } from './select-manufacture/select-manufacture.component';
import { SearchProductComponent } from './search-product/search-product.component';
import { SelectReceiveUnitComponent } from './select-receive-unit/select-receive-unit.component';
import { SearchLabelerComponent } from './search-labeler/search-labeler.component';
import { ModalSearchPurchasesComponent } from './modal-search-purchases/modal-search-purchases.component';
import { ClarityModule } from '@clr/angular';
import { SearchPeopleComponent } from './search-people/search-people.component';
import { HelperModule } from 'app/helper/helper.module';
import { ModalReceiveApproveComponent } from './modal-receive-approve/modal-receive-approve.component';
import { ModalReceiveApproveOtherComponent } from './modal-receive-approve-other/modal-receive-approve-other.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { ModalFileUploadComponent } from './modal-file-upload/modal-file-upload.component';
import { SelectWarehousesComponent } from './select-warehouses/select-warehouses.component';
import { SearchProductWarehouseComponent } from './search-product-warehouse/search-product-warehouse.component';
import { ModalsModule } from 'app/modals/modals.module';
import { SelectLotsComponent } from 'app/directives/select-lots/select-lots.component';
import { ViewReceiveApproveComponent } from './view-receive-approve/view-receive-approve.component';
import { RemainProductsWarehouseComponent } from './remain-products-warehouse/remain-products-warehouse.component';
import { SearchDonatorComponent } from 'app/directives/search-donator/search-donator.component';
import { SelectGenericWarehouseComponent } from 'app/directives/select-generic-warehouse/select-generic-warehouse.component';
import { UpperCaseDirective } from './upper-case.directive';
import { ModalSearchRequisitionComponent } from './modal-search-requisition/modal-search-requisition.component';
import { ViewProductRemainComponent } from './view-product-remain/view-product-remain.component';
import { ViewRequsitionAllComponent } from './view-requsition-all/view-requsition-all.component';
import { ViewRequsitionReserveComponent } from './view-requsition-reserve/view-requsition-reserve.component';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { SelectReceiveLotsWarehouseComponent } from 'app/directives/select-receive-lots-warehouse/select-receive-lots-warehouse.component';
import { SearchProductWarehouseStaffComponent } from 'app/directives/search-product-warehouse-staff/search-product-warehouse-staff.component';
import { SearchGenericWarehouseAutocompleteComponent } from 'app/directives/search-generic-warehouse-autocomplete/search-generic-warehouse-autocomplete.component';
import { SearchGenericWarehouseZeroComponent } from './search-generic-warehouse-zero/search-generic-warehouse-zero.component';
import { ShowUnitsComponent } from './show-units/show-units.component';
import { HisMappingsDirectivesComponent } from './his-mappings-directives/his-mappings-directives.component';
import { SearchPeopleAutoCompleteComponent } from 'app/directives/search-people-autocomplete/search-people-autocomplete.component';
import { SearchProductTmtComponent } from './search-product-tmt/search-product-tmt.component';
import { ModalReceiveApproveOtherStaffComponent } from './modal-receive-approve-other-staff/modal-receive-approve-other-staff.component';
import { SelectGenericTypeComponent } from './select-generic-type/select-generic-type.component';
import { SearchGenericAutocompleteAllComponent } from './search-generic-autocomplete-all/search-generic-autocomplete-all.component';
@NgModule({
    imports: [
        CommonModule,
        ClarityModule,
        FormsModule,
        AgxTypeaheadModule,
        HelperModule,
        TextMaskModule,
        MyDatePickerTHModule,
        ModalsModule
    ],
    declarations: [
        // SelectLotsComponent,
        SelectUnitsComponent,
        SelectVendorComponent,
        SelectReceiveLotsComponent,
        SelectProductWarehouseComponent,
        SelectGenericWarehouseComponent,
        SelectProductLocationComponent,
        SelectManufactureComponent,
        SearchProductComponent,
        SelectReceiveUnitComponent,
        SearchLabelerComponent,
        ModalSearchPurchasesComponent,
        SearchPeopleComponent,
        ModalReceiveApproveComponent,
        ModalReceiveApproveOtherComponent,
        ModalFileUploadComponent,
        SelectWarehousesComponent,
        SearchProductWarehouseComponent,
        SearchGenericAutocompleteComponent,
        SelectLotsComponent,
        ViewReceiveApproveComponent,
        RemainProductsWarehouseComponent,
        SearchDonatorComponent,
        UpperCaseDirective,
        ModalSearchRequisitionComponent,
        ViewProductRemainComponent,
        ViewRequsitionAllComponent,
        ViewRequsitionReserveComponent,
        SelectReceiveLotsWarehouseComponent,
        SearchProductWarehouseStaffComponent,
        SearchGenericWarehouseAutocompleteComponent,
        SearchGenericWarehouseZeroComponent,
        ShowUnitsComponent,
        HisMappingsDirectivesComponent,
        SearchPeopleAutoCompleteComponent,
        SearchProductTmtComponent,
        ModalReceiveApproveOtherStaffComponent,
        SelectGenericTypeComponent,
        SearchGenericAutocompleteAllComponent
    ],
    providers: [BasicService],
    exports: [
        // SelectLotsComponent,
        SelectUnitsComponent,
        SelectVendorComponent,
        SelectReceiveLotsComponent,
        SelectProductWarehouseComponent,
        SelectGenericWarehouseComponent,
        SelectProductLocationComponent,
        SelectManufactureComponent,
        SearchProductComponent,
        SelectReceiveUnitComponent,
        SearchLabelerComponent,
        ModalSearchPurchasesComponent,
        SearchPeopleComponent,
        ModalReceiveApproveComponent,
        ModalReceiveApproveOtherComponent,
        ModalFileUploadComponent,
        SelectWarehousesComponent,
        SearchProductWarehouseComponent,
        SearchGenericAutocompleteComponent,
        SelectLotsComponent,
        ViewReceiveApproveComponent,
        RemainProductsWarehouseComponent,
        SearchDonatorComponent,
        UpperCaseDirective,
        ModalSearchRequisitionComponent,
        ViewProductRemainComponent,
        ViewRequsitionAllComponent,
        ViewRequsitionReserveComponent,
        SelectReceiveLotsWarehouseComponent,
        SearchProductWarehouseStaffComponent,
        SearchGenericWarehouseAutocompleteComponent,
        SearchGenericWarehouseZeroComponent,
        ShowUnitsComponent,
        HisMappingsDirectivesComponent,
        SearchPeopleAutoCompleteComponent,
        SearchProductTmtComponent,
        ModalReceiveApproveOtherStaffComponent,
        SelectGenericTypeComponent,
        SearchGenericAutocompleteAllComponent
    ]
})
export class DirectivesModule { }

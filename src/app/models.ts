export interface ILabeler {
  labelerId?: string;
  labelerName?: string;
  labelerDescription?: string;
  labelerNin?: string;
  labelerTypeId?: string;
  labelerStatusId?: string;
  labelerDisableDate?: string;
  labelerAddress?: string;
  labelerTambon?: string;
  labelerAmpur?: string;
  labelerProvince?: string;
  labelerZipCode?: string;
  labelerPhone?: string;
  labelerUrl?: string;
}

export interface IOrganization {
  orgNo?: string;
  orgYearRegister?: string;
  orgYearEstablished?: string;
  orgCountry?: string;
  orgFADNumber?: string;
  orgLatitude?: number;
  orgLongitude?: number;
}

export interface IWarehouse {
  warehouseName?: string;
  warehouseId?: any;
  typeId?: any;
  location?: string;
}
export interface IWarehouseStructure {
  warehouse_name?: string;
  warehouse_id?: any;
  type_id?: any;
  location?: string;
}

export interface IType {
  typeId?: any;
  typeName?: any;
  typeDesc?: any;
}

export interface ITypeStructure {
  type_id?: any;
  type_name?: any;
  type_desc?: any;
}

export interface ILocation {
  locationId?: any;
  locationName?: any;
  locatioDesc?: any;
}

export interface ILocationStructure {
  location_id?: any;
  location_name?: any;
  location_desc?: any;
}

export interface IProductReceive {
  productId?: any;
  productName?: string;
  receiveQty?: number;
  largeQty?: number;
  packageId?: any;
  largePackageId?: any;
  largePackageName?: string;
  largePrice?: number;
  largeCost?: number;
  expiredDate?: any;
  lotNo?: string;
  locationId?: any;
  locationName?: string;
}

export interface IUnitIssue {
  unitissueId?: any;
  unitissueName?: any;
  unitissueDesc?: any;
}

export interface IUnitIssueStructure {
  unitissue_id?: any;
  unitissue_name?: any;
  unitissue_desc?: any;
  is_rawmaterial?: any;
}

export interface IReceive {
  warehouseId: any;
  receiveDate: any;
  deliveryCode: any;
  deliveryDate: any;
  labelerId: any;
  receiveTypeId: any;
  receiveStatusId: any;
  totalPrice: number;
  totalCost: number;
  receiveQty: number;
  receiveCode?: any;
  purchaseId?: any;
  purchaseTypeId?: any;
  contactId?: any;
  approveId?: any;
}

export interface IRequisitionType {
  requisitionTypeId?: any;
  requisitionTypeName?: any;
  requisitionTypeDesc?: any;
}

export interface IRequisitionTypeStructure {
  requisition_type_id?: any;
  requisition_type?: any;
  requisition_type_desc?: any;
}
export interface ITransectionTypeStructure {
  transaction_id?: any;
  transaction_name?: any;
}
export interface IReceiveotherTypeStructure {
  receive_type_id?: any;
  receive_type_name?: any;
}

export interface IRequisition {
  requisitionID?: any;
  receiveId?: string;
  requisitionDate?: any;
  wmRequisition?: any;
  wmWithdraw?: any;
  requisitionTypeID?: any;
  documentType?: any;
  costAmt?: any;
  ItemQty?: any;
}

export interface IRequisitionStructure {
  requisition_date?: any;
  wm_requisition?: any;
  wm_withdraw?: any;
  document_type?: any;
  requisition_type_id?: any;
}

export interface ICheckSummaryParams {
  receiveId?: string;
  checkId?: string;
  checkDate?: any;
  peopleId?: any;
  warehouseId?: any;
  comment?: any;
  confirmDate?: any;
  requisitionId?: string;

}

export interface ICheckSummaryFields {
  receive_id?: string;
  check_id?: string;
  check_date?: any;
  people_id?: any;
  warehouse_id?: any;
  comment?: any;
}

export interface ICheckProductParams {
  isFree?: any;
  checkId?: any;
  packageId?: any;
  cost?: number;
  qty?: number;
  productId?: any;
  expiredDate?: any;
  lotNo?: any;
}

export interface ICheckProductFields {
  is_free?: any;
  package_id?: any;
  cost?: number;
  qty?: number;
  product_id?: any;
  expired_date?: any;
  lot_no?: any;
  check_id?: any;
}

export interface IProductRequisition {
  productId?: any;
  productName?: string;
  requisitionQty?: number;
  largeQty?: number;
  packageId?: any;
  largePackageId?: any;
  largePackageName?: string;
  smallPackageName?: string;
  smallQty?: number;
  unitCost?: number;
  largePrice?: number;
  largeCost?: any;
  expiredDate?: any;
  lotNo?: string;
  locationId?: any;
  locationName?: string;
  checkID?: string;
  receiveID?: string;
  lotID?: string;
  warehouseId?: number;
  wmRequisition?: number;
  requisitionDate?: any;
  is_selected?: any;
  generic_id?: any;
  product_id?: any;
}


export interface IConfirmSummaryParams {
  receiveId?: string;
  checkId?: string;
  checkDate?: any;
  peopleId?: any;
  warehouseId?: any;
  comment?: any;
  confirmDate?: any;
  requisitionId?: string;

}

export interface IConfirmSummaryFields {
  receive_id?: string;
  check_id?: string;
  check_date?: any;
  people_id?: any;
  warehouse_id?: any;
  comment?: any;
}

export interface IConfirmProductParams {
  isFree?: any;
  checkId?: any;
  packageId?: any;
  cost?: number;
  qty?: number;
  productId?: any;
  expiredDate?: any;
  lotNo?: any;
  lotId?: any;
}

export interface IConfirmProductFields {
  is_free?: any;
  package_id?: any;
  cost?: number;
  qty?: number;
  product_id?: any;
  expired_date?: any;
  lot_no?: any;
  check_id?: any;
}

export interface IProductBorrowParams {
  productId?: string;
  productName?: string;
  qty?: number;
  price?: number;
  largeUnit?: string;
}

export interface IProductBorrowFields {
  id?: any;
  product_id?: string;
  product_name?: string;
  cost?: number;
  largeUnit?: string;
  qty?: number;
}

export interface Iissue {
  warehouseId: any;
  issueId?: any;
  unitIssueId: any;
  issueDate: any;
  totalPrice: number;
  totalCost: number;
  issueQty: number;
  approveId?: any;
}

export interface IProductIssue {
  productId?: any;
  productName?: string;
  issueQty?: number;
  largeQty?: number;
  packageId?: any;
  largePackageId?: any;
  largePackageName?: string;
  smallPackageName?: string;
  largePrice?: number;
  largeCost?: number;
  expiredDate?: any;
  lotNo?: string;
  locationId?: any;
  locationName?: string;
  issueID?: string;
  lotID?: string;
  warehouseId?: number;
  issueDate?: any;
}
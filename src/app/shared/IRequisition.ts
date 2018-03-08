export interface IRequisitionPayItem {
  requisition_detail_id?: any;
  requisition_order_id?: any;
  product_id?: any;
  expired_date?: any;
  lot_no?: any;
  cost?: any;
  requisition_qty?: any;
  requisition_date?: any;
  location_id?: any;
  receive_id?: any;
  unit_generic_id?: any;
}

export interface IRequisitionOrderItem {
  requisition_item_id?: any;
  requisition_order_id?: any;
  generic_id?: any;
  working_code?: any;
  generic_name?: any;
  requisition_qty?: number;
  to_unit_qty?: number;
  primary_unit_name?: any;
  unit_generic_id?: any;
  remain_qty?: number;
}

export interface IRequisitionOrder {
  requisition_order_id?: any;
  requisition_code?: any;
  requisition_date?: any;
  wm_requisition?: any;
  wm_withdraw?: any;
  requisition_warehouse_name?: any;
  withdraw_warehouse_name?: any;
  requisition_type_id?: any;
  requisition_type?: any;
  requisition_status?: any;
  remark?: any;
  doc_type?: any;
  people_id?: any;
  is_approved?: any;
  approve_date?: any;
  approve_people_id?: any;
  is_temp?: any;
}


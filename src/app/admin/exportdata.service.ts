import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ExportdataService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) {

  }

  async getDrugList(query: any) {
    const rs = await this.authHttp.get(`${this.url}/api/view-drug-list?query=${query}`).toPromise();
    return rs.json();
  }

  async getDrugListHistoryByperiodRpt(periodRpt :any) {
    const rs = await this.authHttp.get(`${this.url}/api/dmsicapi-drug-list/period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async saveAllDruglist(periodRpt:any){
    const body = {}; // provide the appropriate payload here
    const rs = await this.authHttp.post(`${this.url}/api/dmsicapi-drug-list/save?periodRpt=${periodRpt}`, body).toPromise();
    return rs.json();
  }

  async deleteDrugListById(data:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-drug-list/delete-by-id`, { body: data }).toPromise();
    return rs.json();
  }

  async deleteDrugByperiodRpt(periodRpt:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-drug-list/delete-by-period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async getPurchasePlan(query: any) {
    const rs = await this.authHttp.get(`${this.url}/api/view-purchaser-plan?query=${query}`).toPromise();
    return rs.json();
  }

  async getPurchasePlanHistoryByperiodRpt(periodRpt :any) {
    const rs = await this.authHttp.get(`${this.url}/api/dmsicapi-purchaser-plan/period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async saveAllPurchasePlan(periodRpt:any){
    const body = {}; // provide the appropriate payload here
    const rs = await this.authHttp.post(`${this.url}/api/dmsicapi-purchaser-plan/save?periodRpt=${periodRpt}`, body).toPromise();
    return rs.json();
  }

  async deletePurchasePlanById(data:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-purchaser-plan/delete-by-id`, { body: data }).toPromise();
    return rs.json();
  }

  async deletePurchasePlanByperiodRpt(periodRpt:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-purchaser-plan/delete-by-period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async deletePurchasePlanByBudgeYear(budgeYear:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-purchaser-plan/delete-by-budgeYear?budgeYear=${budgeYear}`).toPromise();
    return rs.json();
  }

  async getReceipt(startDate: any, endDate: any) {
    const rs = await this.authHttp.get(`${this.url}/api/view-receipt?startDate=${startDate}&endDate=${endDate}`).toPromise();
    return rs.json();
  }

  async getReceiptHistoryByperiodRpt(periodRpt :any) {
    const rs = await this.authHttp.get(`${this.url}/api/dmsicapi-receipt/period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async saveAllReceipt(startDate: any, endDate: any, periodRpt:any){
    const body = {startDate, endDate}; // provide the appropriate payload here
    const rs = await this.authHttp.post(`${this.url}/api/dmsicapi-receipt/save?periodRpt=${periodRpt}`, body).toPromise();
    return rs.json();
  }

  async deleteReceiptById(data:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-receipt/delete-by-id`, { body: data }).toPromise();
    return rs.json();
  }

  async deleteReceiptByperiodRpt(periodRpt:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-receipt/delete-by-period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async getDistribution(startDate: any, endDate: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/api/view-distribution?startDate=${startDate}&endDate=${endDate}&warehouseId=${warehouseId}`).toPromise();
    return rs.json();
  }

  async getDistributionHistoryByperiodRpt(periodRpt :any) {
    const rs = await this.authHttp.get(`${this.url}/api/dmsicapi-distribution/period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async saveAllDistribution(startDate: any, endDate: any, periodRpt:any, warehouseId: any){
    const body = {startDate, endDate}; // provide the appropriate payload here
    const rs = await this.authHttp.post(`${this.url}/api/dmsicapi-distribution/save?periodRpt=${periodRpt}&warehouseId=${warehouseId}`, body).toPromise();
    return rs.json();
  }

  async deleteDistributionByperiodRpt(periodRpt:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-distribution/delete-by-period-rpt?periodRpt=${periodRpt}`).toPromise();
    return rs.json();
  }

  async getInventory(query: any, warehouseId:any) {
    const rs = await this.authHttp.get(`${this.url}/api/view-inventory?query=${query}&warehouseId=${warehouseId}`).toPromise();
    return rs.json();
  }

  async getInventoryHistoryBydateOnhand(date :any) {
    const rs = await this.authHttp.get(`${this.url}/api/dmsicapi-inventory/date-on-hand?date=${date}`).toPromise();
    return rs.json();
  }

  async saveAllInventory(dateOnhand:any, warehouseId:any){
    const body = {}; // provide the appropriate payload here
    const rs = await this.authHttp.post(`${this.url}/api/dmsicapi-inventory/save?dateOnhand=${dateOnhand}&warehouseId=${warehouseId}`, body).toPromise();
    return rs.json();
  }

  async deleteInventoryBydateOnhand(date:any){
    const rs = await this.authHttp.delete(`${this.url}/api/dmsicapi-inventory/delete-by-date-on-hand?date=${date}`).toPromise();
    return rs.json();
  }

  async getToken() {
    const rs = await this.authHttp.get(`${this.url}/api/token-api`).toPromise();
    return rs.json();
  }

  async saveToken(token: any) {
    const body = { token };
    const rs = await this.authHttp.post(`${this.url}/api/token-api/save`, body).toPromise();
    return rs.json();
  }

  async testToken(token: any) {
    const body = { token };
    const rs = await this.authHttp.post(`${this.url}/api/token-api/test`, body).toPromise();
    return rs.json();
  }

}

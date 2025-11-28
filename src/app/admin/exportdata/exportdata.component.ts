import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { AlertService } from "../../alert.service";
import { ExportdataService } from "../exportdata.service";
import { BasicService } from "../../basic.service";
import { ProductsService } from "../products.service";
import { IMyOptions } from "mydatepicker-th";

@Component({
  selector: "wm-exportdata",
  templateUrl: "./exportdata.component.html",
  styleUrls: [],
})
export class ExportdataComponent implements OnInit {
  @ViewChild("modalLoading") public modalLoading: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: "dd mmm yyyy",
    editableDateField: false,
    showClearDateBtn: false,
  };
  date = new Date();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();
  dataYear = [];

  druglist: any = [];
  druglistHistory: any = [];
  productCategory: any = [];
  queryGen: string = "";
  modalDrugListHistory: any = false;

  purchasePlanList: any = [];
  purchasePlanHistory: any = [];
  modalPurchasePlanHistory: any = false;

  receiptList: any = [];
  receiptHistory: any = [];
  buyMethod: any = [];
  startDateReceipt: any;
  endDateReceipt: any;
  modalReceiptHistory: any = false;

  distributionList: any = [];
  distributionHistory: any = [];
  startDateDistribution: any;
  endDateDistribution: any;
  modalDistributionHistory: any = false;

  inventoryList: any = [];
  queryProduct: string = "";
  inventoryHistory: any = [];
  dateOnhand: any;
  modalInventoryHistory: any = false;

  errorList: any = [];
  modalErrorList: any = false;

  token: any;
  modalToken: any = false;

  constructor(
    private alertService: AlertService,
    private exportdataService: ExportdataService,
    private basicService: BasicService,
    private productsService: ProductsService,
    @Inject("API_URL") private apiUrl: string
  ) {}

  ngOnInit() {
    this.getPurchasePlan();
    for (let i = 0; i < 11; i++) {
      this.dataYear.push(this.date.getFullYear() + 1 - i);
    }
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.startDateReceipt = {
      date: {
        year: firstDay.getFullYear(),
        month: firstDay.getMonth() + 1,
        day: firstDay.getDate(),
      },
    };
    this.endDateReceipt = {
      date: {
        year: lastDay.getFullYear(),
        month: lastDay.getMonth() + 1,
        day: lastDay.getDate(),
      },
    };

    this.startDateDistribution = {
      date: {
        year: firstDay.getFullYear(),
        month: firstDay.getMonth() + 1,
        day: firstDay.getDate(),
      },
    };
    this.endDateDistribution = {
      date: {
        year: lastDay.getFullYear(),
        month: lastDay.getMonth() + 1,
        day: lastDay.getDate(),
      },
    };

    this.dateOnhand = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
    };
  }

  exportRemain() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/report/remain/qty/export?token=${token}`;
    window.open(url, "_blank");
  }

  exportRemainTrade() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/report/remain-trade/qty/export?token=${token}`;
    window.open(url, "_blank");
  }

  exportDistribute() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/reports/export/distribute?token=${token}`;
    window.open(url, "_blank");
  }

  exportDruglist() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/reports/export/druglist?token=${token}`;
    window.open(url, "_blank");
  }

  exportInventory() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/reports/export/inventory?token=${token}`;
    window.open(url, "_blank");
  }

  exportReceive() {
    const token = sessionStorage.getItem("token");
    const url = `${this.apiUrl}/reports/export/receive?token=${token}`;
    window.open(url, "_blank");
  }

  async getProductCategoryName() {
    try {
      const rs: any = await this.basicService.getBiProductCategories();
      if (rs.ok) {
        this.productCategory = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getBuyMethod(){
    try {
      const rs: any = await this.basicService.getBiBuyMethod();
      if (rs.ok) {
        this.buyMethod = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onChangeProductCat(item: any) {
    try {
      const rs = await this.productsService.updateProductCat({
        genericId: item.GENERIC_ID,
        productCat: item.PRODUCT_CAT,
      });
      if (rs.ok) {
        this.alertService.success("อัพเดทข้อมูลเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getDruglist() {
    try {
      this.modalLoading.show();
      await this.getProductCategoryName();
      const rs: any = await this.exportdataService.getDrugList(this.queryGen);
      if (rs.ok) {
        this.modalLoading.hide();
        this.druglist = rs.rows;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async getDrugListHistoryByperiodRpt() {
    try {
      const periodRpt = `${this.year}${
        this.month < 10 ? "0" + this.month : this.month
      }`;
      this.modalDrugListHistory = true;
      const rs: any =
        await this.exportdataService.getDrugListHistoryByperiodRpt(periodRpt);
      if (rs.ok) {
        this.druglistHistory = rs.rows;
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async saveAllDruglist() {
    try {
      this.alertService
        .confirm("ต้องการส่งข้อมูลทั้งหมด ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();
          const rs: any = await this.exportdataService.saveAllDruglist();

          if (rs.ok) {
            this.modalLoading.hide();
            if (rs.statusCode === 400) {
              this.modalLoading.hide();
              this.alertService.error("มีบางรายการที่ส่งข้อมูลไม่สำเร็จ");
              this.errorList = rs.error;
              this.modalErrorList = true;
            } else if (rs.statusCode === 200) {
              this.modalLoading.hide();
              this.alertService.success(
                "ส่งข้อมูลเรียบร้อยแล้ว " + rs.count + " รายการ"
              );
            }
          } else {
            this.modalLoading.hide();
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDrugById(item: any) {
    try {
      this.alertService
        .confirm("ต้องการลบรายการนี้ ใช่หรือไม่?")
        .then(async () => {
          const rs: any = await this.exportdataService.deleteDrugListById(item);
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getDrugListHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDrugByperiodRpt() {
    try {
      this.alertService
        .confirm("ต้องการลบรายการทั้งหมดของเดือนนี้ ใช่หรือไม่?")
        .then(async () => {
          const periodRpt = `${this.year}${
            this.month < 10 ? "0" + this.month : this.month
          }`;
          const rs: any = await this.exportdataService.deleteDrugByperiodRpt(
            periodRpt
          );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getDrugListHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchasePlan() {
    try {
      this.modalLoading.show();
      const rs: any = await this.exportdataService.getPurchasePlan(
        this.queryGen
      );
      if (rs.ok) {
        this.modalLoading.hide();
        this.purchasePlanList = rs.rows;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async getPurchasePlanHistoryByperiodRpt() {
    try {
      const periodRpt = `${this.year}${
        this.month < 10 ? "0" + this.month : this.month
      }`;
      this.modalPurchasePlanHistory = true;
      const rs: any =
        await this.exportdataService.getPurchasePlanHistoryByperiodRpt(
          periodRpt
        );
      if (rs.ok) {
        this.purchasePlanHistory = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveAllPurchasePlan() {
    try {
      this.alertService
        .confirm("ต้องการส่งข้อมูลแผนจัดซื้อทั้งหมด ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();
          const rs: any = await this.exportdataService.saveAllPurchasePlan();

          if (rs.ok) {
            this.modalLoading.hide();
            if (rs.statusCode === 400) {
              this.modalLoading.hide();
              this.alertService.error("มีบางรายการที่ส่งข้อมูลไม่สำเร็จ");
              this.errorList = rs.error;
              this.modalErrorList = true;
            } else if (rs.statusCode === 200) {
              this.modalLoading.hide();
              this.alertService.success(
                "ส่งข้อมูลเรียบร้อยแล้ว " + rs.count + " รายการ"
              );
            }
          } else {
            this.modalLoading.hide();
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async deletePurchasePlanById(item: any) {
    try {
      this.alertService
        .confirm("ต้องการลบรายการนี้ ใช่หรือไม่?")
        .then(async () => {
          const rs: any = await this.exportdataService.deletePurchasePlanById(
            item
          );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getPurchasePlanHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async deletePurchasePlanByperiodRpt() {
    try {
      this.alertService
        .confirm("ต้องการลบรายการทั้งหมดของเดือนนี้ ใช่หรือไม่?")
        .then(async () => {
          const periodRpt = `${this.year}${
            this.month < 10 ? "0" + this.month : this.month
          }`;
          const rs: any =
            await this.exportdataService.deletePurchasePlanByperiodRpt(
              periodRpt
            );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getPurchasePlanHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async deletePurchasePlanByBudgeYear() {
    try {
      const monthNum = this.month;
      const budgetYear = monthNum >= 10 ? this.year + 1 : this.year;
      this.alertService
        .confirm(
          `ต้องการลบรายการแผนจัดซื้อทั้งหมดตามงบประมาณ ${
            budgetYear + 543
          } ใช่หรือไม่?`
        )
        .then(async () => {
          const rs: any =
            await this.exportdataService.deletePurchasePlanByBudgeYear(
              budgetYear
            );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getPurchasePlan();
            this.getPurchasePlanHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async getReceipt() {
    try {
      await this.getBuyMethod();

      const start = this.startDateReceipt.date;
      const startDate =
        String(start.year) +
        ("0" + start.month).slice(-2) +
        ("0" + start.day).slice(-2);

      const end = this.endDateReceipt.date;
      const endDate =
        String(end.year) +
        ("0" + end.month).slice(-2) +
        ("0" + end.day).slice(-2);

      const rs: any = await this.exportdataService.getReceipt(
        startDate,
        endDate
      );
      if (rs.ok) {
        this.modalLoading.hide();
        this.receiptList = rs.rows;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async onChangeBuyMethod(item){
    try {
      const rs = await this.productsService.updateBuyMethod({
        purchaseOrderId: item.PURCHASE_ORDER_ID,
        BuyMethodId: item.BUY_METHOD_ID,
      });
      if (rs.ok) {
        this.alertService.success("อัพเดทข้อมูลเรียบร้อยแล้ว");
        this.getReceipt();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getReceiptHistoryByperiodRpt() {
    try {
      const periodRpt = `${this.year}${
        this.month < 10 ? "0" + this.month : this.month
      }`;
      this.modalReceiptHistory = true;
      const rs: any =
        await this.exportdataService.getReceiptHistoryByperiodRpt(
          periodRpt
        );
      if (rs.ok) {
        this.receiptHistory = rs.rows;
        console.log(this.receiptHistory);
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async saveAllReceipt() {
    try {
      const start = this.startDateReceipt.date;
      const startDate =
        String(start.year) +
        ("0" + start.month).slice(-2) +
        ("0" + start.day).slice(-2);

      const end = this.endDateReceipt.date;
      const endDate =
        String(end.year) +
        ("0" + end.month).slice(-2) +
        ("0" + end.day).slice(-2);

      this.alertService
        .confirm("ต้องการส่งข้อมูลการรับเข้าของยา ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();

          const rs: any = await this.exportdataService.saveAllReceipt(startDate, endDate);
          
          if (rs.ok) {
            this.modalLoading.hide();
            if (rs.statusCode === 400) {
              this.modalLoading.hide();
              this.alertService.error("มีบางรายการที่ส่งข้อมูลไม่สำเร็จ");
              this.errorList = rs.error;
              this.modalErrorList = true;
            } else if (rs.statusCode === 200) {
              this.modalLoading.hide();
              this.alertService.success(
                "ส่งข้อมูลเรียบร้อยแล้ว " + rs.count + " รายการ"
              );
            }
          } else {
            this.modalLoading.hide();
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {
          this.modalLoading.hide();
        });
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async deleteReceiptById(item: any) {
    try {
      this.alertService
        .confirm("ต้องการลบรายการนี้ ใช่หรือไม่?")
        .then(async () => {
          const rs: any = await this.exportdataService.deleteReceiptById(item);
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getReceiptHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {
          this.modalLoading.hide();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteReceiptByperiodRpt() {
    try {
      this.alertService
        .confirm("ต้องการลบรายการทั้งหมดของเดือนนี้ ใช่หรือไม่?")
        .then(async () => {
          const periodRpt = `${this.year}${
            this.month < 10 ? "0" + this.month : this.month
          }`;
          const rs: any =
            await this.exportdataService.deleteReceiptByperiodRpt(
              periodRpt
            );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getReceiptHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {
          this.modalLoading.hide();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getDistribution() {
    try {
      const start = this.startDateDistribution.date;
      const startDate =
        String(start.year) +
        ("0" + start.month).slice(-2)

      const end = this.endDateDistribution.date;
      const endDate =
        String(end.year) +
        ("0" + end.month).slice(-2)

      this.modalLoading.show();
      const rs: any = await this.exportdataService.getDistribution(startDate, endDate);
      if (rs.ok) {
        this.modalLoading.hide();
        this.distributionList = rs.rows;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async getDistributionHistoryByperiodRpt() {
    try {
      const periodRpt = `${this.year}${
        this.month < 10 ? "0" + this.month : this.month
      }`;
      this.modalDistributionHistory = true;
      const rs: any =
        await this.exportdataService.getDistributionHistoryByperiodRpt(
          periodRpt
        );
        
      if (rs.ok) {
        this.distributionHistory = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveAllDistribution() {
    try {
      const start = this.startDateDistribution.date;
      const startDate =
        String(start.year) +
        ("0" + start.month).slice(-2) 

      const end = this.endDateDistribution.date;
      const endDate =
        String(end.year) +
        ("0" + end.month).slice(-2)

      this.alertService
        .confirm("ต้องการส่งข้อมูลการตัดจ่ายยา ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();

          const rs: any = await this.exportdataService.saveAllDistribution(startDate, endDate);
          
          if (rs.ok) {
            this.modalLoading.hide();
            if (rs.statusCode === 400) {
              this.alertService.error("มีบางรายการที่ส่งข้อมูลไม่สำเร็จ");
              this.errorList = rs.error;
              console.log(this.errorList);
              
              this.modalErrorList = true;
              this.modalLoading.hide();
            } else if (rs.statusCode === 200) {
              this.modalLoading.hide();
              this.alertService.success(
                "ส่งข้อมูลเรียบร้อยแล้ว " + rs.count + " รายการ"
              );
            }
          } else {
            this.alertService.error(rs.error);
            this.modalLoading.hide();
          }
          this.modalLoading.hide();
        })
        .catch(() => {
          this.modalLoading.hide();
        });
        this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async deleteDistributionByperiodRpt(){
    try {
      this.alertService
        .confirm("ต้องการลบรายการทั้งหมดของเดือนนี้ ใช่หรือไม่?")
        .then(async () => {
          const periodRpt = `${this.year}${
            this.month < 10 ? "0" + this.month : this.month
          }`;
          const rs: any =
            await this.exportdataService.deleteDistributionByperiodRpt(
              periodRpt
            );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getDistributionHistoryByperiodRpt();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {
          this.modalLoading.hide();
        });
    } catch (error) {
      console.log(error);
    }
  }

  async getInventory() {
    try {
      this.modalLoading.show();
      const rs: any = await this.exportdataService.getInventory(this.queryProduct);
      if (rs.ok) {
        this.modalLoading.hide();
        this.inventoryList = rs.rows;
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
    }
  }

  async getInventoryHistoryBydateOnhand() {
    try {
      const date = `${this.dateOnhand.date.year}-${this.dateOnhand.date.month}-${this.dateOnhand.date.day}`;
      
      this.modalInventoryHistory = true;
      const rs: any =
        await this.exportdataService.getInventoryHistoryBydateOnhand(
          date
        );
      if (rs.ok) {
        this.inventoryHistory = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveAllInventory() {
    try {
      this.alertService
        .confirm("ต้องการส่งข้อมูลรายการยาคงเหลือในหน่วยบริการ ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();

          const rs: any = await this.exportdataService.saveAllInventory();
          
          if (rs.ok) {
            this.modalLoading.hide();
            if (rs.statusCode === 400) {
              this.alertService.error("มีบางรายการที่ส่งข้อมูลไม่สำเร็จ");
              this.errorList = rs.error;
              console.log(this.errorList);
              
              this.modalErrorList = true;
              this.modalLoading.hide();
            } else if (rs.statusCode === 200) {
              this.modalLoading.hide();
              this.alertService.success(
                "ส่งข้อมูลเรียบร้อยแล้ว " + rs.count + " รายการ"
              );
            }
          } else {
            this.alertService.error(rs.error);
            this.modalLoading.hide();
          }
          this.modalLoading.hide();
        })
        .catch(() => {
          this.modalLoading.hide();
        });
        this.modalLoading.hide();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteInventoryBydateOnhand(){
    try {
      const date = `${this.dateOnhand.date.year}-${this.dateOnhand.date.month}-${this.dateOnhand.date.day}`;

      this.alertService
        .confirm(`ต้องการลบรายการทั้งหมดของวันที่ ${date} ใช่หรือไม่?`)
        .then(async () => {
          const rs: any =
            await this.exportdataService.deleteInventoryBydateOnhand(
              date
            );
          if (rs.ok) {
            this.alertService.success("ลบรายการเรียบร้อยแล้ว");
            this.getInventoryHistoryBydateOnhand();
          } else {
            this.alertService.error(rs.error);
          }
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }

  async openModalToken() {
    try {
      const rs: any = await this.exportdataService.getToken();
      if (rs.ok) {
        this.token = rs.rows;
      }
    } catch (error) {
      console.log(error);
    }
    this.modalToken = true;
  }

  async saveToken() {
    try {
      this.alertService
        .confirm("ต้องการบันทึก Token ใหม่ ใช่หรือไม่?")
        .then(async () => {
          this.modalLoading.show();

          const rs: any = await this.exportdataService. saveToken(this.token);
          if (rs.ok) {
            this.modalLoading.hide();
            this.alertService.success("บันทึก Token เรียบร้อยแล้ว");
            this.modalToken = false;
          } else {
            this.alertService.error(rs.error);
            this.modalLoading.hide();
          }
          this.modalLoading.hide();
        })
        .catch(() => {
          this.modalLoading.hide();
        });
        this.modalLoading.hide();
    } catch (error) {
      console.log(error);
    }
  }

  async testToken() {
    try {
      const rs: any = await this.exportdataService.testToken(this.token);
      if (rs.ok) {
        this.alertService.success("Token ใช้งานได้ปกติ");
      } else {
        this.alertService.error("Token ไม่ถูกต้อง");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

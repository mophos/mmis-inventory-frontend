import { TransectionTypeService } from './admin/transection-type.service';
import { PeriodService } from './period.service';
import { SettingService } from './setting.service';
import { StaffModule } from './staff/staff.module';
import { BrowserModule, } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '@clr/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { DirectivesModule } from './directives/directives.module';

import { AlertService } from './alert.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DenyComponent } from './deny/deny.component';

import { UsersService } from './users.service';
import { UomService } from './uom.service';
import { ImportStockComponent } from './import-stock/import-stock.component';
import { AccessCheck } from './access-check';
import { AuthBorrowService } from './auth-borrow.service';
// import { PeriodComponent } from './admin/period/period.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DenyComponent,
    ImportStockComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    BrowserAnimationsModule,
    LoginModule,
    AdminModule,
    StaffModule,
    DirectivesModule,
    AppRoutingModule,
  ],
  providers: [
    AlertService,
    UsersService,
    UomService,
    PeriodService,
    TransectionTypeService,
    SettingService,
    AccessCheck,
    { provide: 'API_URL', useValue: environment.apiUrl },
    { provide: 'API_PORTAL_URL', useValue: environment.portalUrl },
    { provide: 'DOC_URL', useValue: environment.docUrl },
    { provide: 'HOME_URL', useValue: environment.homeUrl },
    { provide: 'LOGIN_URL', useValue: environment.loginUrl },
    { provide: 'REV_PREFIX', useValue: environment.receivePrefix },
    { provide: 'BOR_PREFIX', useValue: environment.borrowPrefix },
    { provide: 'RET_PREFIX', useValue: environment.returningPrefix },
    { provide: 'REQ_PREFIX', useValue: environment.requisitionPrefix },
    { provide: 'INS_PREFIX', useValue: environment.issuePrefix },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

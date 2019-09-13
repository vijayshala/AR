import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AutorenewdetailsComponent } from './autorenewdetails/autorenewdetails.component';
import { orderhistoryComponent } from './orderhistory/orderhistory.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { AutorenewDashboardComponent } from './autorenew-dashboard/autorenew-dashboard.component';
import { ChasedetailsComponent } from './chasedetails/chasedetails.component';
import { RequestdetailsComponent } from './requestdetails/requestdetails.component';
import { ContactdetailsComponent } from './contactdetails/contactdetails.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PodetailsComponent } from './podetails/podetails.component';
import { AuditdetailsComponent } from './auditdetails/auditdetails.component';
import { HeadingsearchComponent } from './headingsearch/headingsearch.component';

// Modules
import { SharedModule } from '../shared/shared.module';

// Directives
import { CdkDetailRowDirective } from '../shared/cdk-detail-row.directive';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AutonrenewProfileComponent } from './autonrenew-profile/autonrenew-profile.component';
import { OrdercenterDetailsComponent } from './ordercenter-details/ordercenter-details.component';
import { ResellerPOdetailsComponent } from './reseller-podetails/reseller-podetails.component';
import { PoDetailstabComponent } from './po-detailstab/po-detailstab.component';
import { T1T2ProfileComponent } from './t1-t2-profile/t1-t2-profile.component';


@NgModule({
    declarations: [
        AutorenewdetailsComponent,
        orderhistoryComponent,
        OrderdetailsComponent,
        AutorenewDashboardComponent,
        ChasedetailsComponent,
        RequestdetailsComponent,
        ContactdetailsComponent,
        NotificationsComponent,
        PodetailsComponent,
        AuditdetailsComponent,
        CdkDetailRowDirective,
        ProfileDetailsComponent,
        HeadingsearchComponent,
        AutonrenewProfileComponent,
        OrdercenterDetailsComponent,
        ResellerPOdetailsComponent,
        PoDetailstabComponent,
        T1T2ProfileComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BsDatepickerModule.forRoot()
    ],
    entryComponents: [],
    providers: [HeadingsearchComponent]

})
export class ComponentsModule { }

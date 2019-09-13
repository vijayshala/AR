import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/*Component Reference */
import { AutorenewDashboardComponent } from './components/autorenew-dashboard/autorenew-dashboard.component';
import { ChasedetailsComponent } from './components/chasedetails/chasedetails.component';
import { RequestdetailsComponent } from './components/requestdetails/requestdetails.component';
import { AuditdetailsComponent } from './components/auditdetails/auditdetails.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ContactdetailsComponent } from './components/contactdetails/contactdetails.component';
import { PodetailsComponent } from './components/podetails/podetails.component';
import { orderhistoryComponent } from './components/orderhistory/orderhistory.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import {AutonrenewProfileComponent} from './components/autonrenew-profile/autonrenew-profile.component';
import {PoDetailstabComponent} from './components/po-detailstab/po-detailstab.component';
import{ResellerPOdetailsComponent} from './components/reseller-podetails/reseller-podetails.component';
import{T1T2ProfileComponent} from './components/t1-t2-profile/t1-t2-profile.component';
import { OrdercenterDetailsComponent } from './components/ordercenter-details/ordercenter-details.component';
const routes: Routes = [
  { path: '', redirectTo: 'autorenewdashboard', pathMatch: 'full' },
  { path: 'autorenewdashboard', component: AutorenewDashboardComponent, pathMatch: 'full' },
  { path: 'distiProfile', component: ProfileDetailsComponent, pathMatch: 'full' },
  { path: 'resellerProfile/:id', component: AutonrenewProfileComponent, pathMatch: 'full' },
  { path: 't1-t2-profile/:id', component:T1T2ProfileComponent, pathMatch: 'full' },
  { path: 'orderhistory', component: orderhistoryComponent, pathMatch: 'full' },
  // { path: 'chasedetails', component: ChasedetailsComponent, pathMatch: 'full' },
  // { path: 'chasedetails/:id', component: ChasedetailsComponent, pathMatch: 'full' },
  {
    path: 'chasedetails/:id/:t1soldto', component: ChasedetailsComponent,
    children: [
      { path: '', redirectTo: 'requestdetails', pathMatch: 'full' },
      { path: 'requestdetails', component: RequestdetailsComponent },
      { path: 'auditdetails', component: AuditdetailsComponent },
      { path: 'contactdetails', component: ContactdetailsComponent },
      { path: 'notification', component: NotificationsComponent },
      {path: 'Ordercenter', component: OrdercenterDetailsComponent},
      {path: 'podetailsTab', component:PoDetailstabComponent,
      children: [
        { path: '', redirectTo: 'podetails', pathMatch: 'full' },
        { path: 'podetails', component:PodetailsComponent},
      { path: 'resellerpodetails',component:ResellerPOdetailsComponent}]},
        ]
      },
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routedComponents = [RequestdetailsComponent,
  AuditdetailsComponent,
  ContactdetailsComponent, NotificationsComponent, PodetailsComponent,ResellerPOdetailsComponent,PoDetailstabComponent];
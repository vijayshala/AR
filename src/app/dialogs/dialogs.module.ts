import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogsComponent } from './dialogs.component';
import { PopromisedialogComponent } from './popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from './optoutdialog/optoutdialog.component';
import { OptindialogComponent } from './optindialog/optindialog.component';
import { SharedModule } from '../shared/shared.module';
import { DialogDraggableTitleDirective } from '../shared/dialog-draggable-title.directive';
import { ModalPositionCache } from '../shared/modal-position.cache';
import { DetailsOptinComponent } from './details-optin/details-optin.component';
import { DetailsoptoutComponent } from './detailsoptout/detailsoptout.component';
import { DashposubmitComponent } from './dashposubmit/dashposubmit.component';
import { DashchangepayerComponent } from './dashchangepayer/dashchangepayer.component';
import { OptOutDashboardComponent } from './opt-out-dashboard/opt-out-dashboard.component';
import { DetailsPoSubmitDialogComponent } from './details-po-submit-dialog/details-po-submit-dialog.component';
import { ResellersubmitComponent } from './resellersubmit/resellersubmit.component';
import { DetailsResellerDialogComponent } from './details-reseller-dialog/details-reseller-dialog.component';
import { ResellerOptoutComponent } from './reseller-optout/reseller-optout.component';
import { DetailsResellerOptoutComponent } from './details-reseller-optout/details-reseller-optout.component';
import { ReselleroptindialogComponent } from './reselleroptindialog/reselleroptindialog.component';
import { DetailsreselleroptindialogComponent } from './detailsreselleroptindialog/detailsreselleroptindialog.component';

@NgModule({
    declarations: [
        DialogsComponent,
        PopromisedialogComponent,
        OptoutdialogComponent,
        OptindialogComponent,
        DialogDraggableTitleDirective,
        DetailsOptinComponent,
        DetailsoptoutComponent,
        DashposubmitComponent,
        DashchangepayerComponent,
        OptOutDashboardComponent,
        DetailsPoSubmitDialogComponent,
        ResellersubmitComponent,
        DetailsResellerDialogComponent,
        ResellerOptoutComponent,
        DetailsResellerOptoutComponent,
        ReselleroptindialogComponent,
        DetailsreselleroptindialogComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    providers: [ModalPositionCache],

    entryComponents: [PopromisedialogComponent, OptoutdialogComponent,OptindialogComponent,
        DetailsOptinComponent,ResellersubmitComponent,ReselleroptindialogComponent,DetailsreselleroptindialogComponent, DetailsResellerOptoutComponent,DetailsoptoutComponent, DashposubmitComponent,DetailsResellerDialogComponent, DashchangepayerComponent, OptOutDashboardComponent, DetailsPoSubmitDialogComponent,ResellerOptoutComponent],

})
export class DialogsModule { }

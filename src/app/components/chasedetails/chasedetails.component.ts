import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { chaseParams } from '../../Model/chaseParams.model';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { Details } from 'src/app/Model/Details';
import { DatePipe } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs';
//dialogs
import { DashposubmitComponent } from 'src/app/dialogs/dashposubmit/dashposubmit.component';
import { PopromisedialogComponent } from '../../dialogs/popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { OptindialogComponent } from '../../dialogs/optindialog/optindialog.component';
import { DashchangepayerComponent } from 'src/app/dialogs/dashchangepayer/dashchangepayer.component';
import { ResellersubmitComponent } from 'src/app/dialogs/resellersubmit/resellersubmit.component';
import{  ResellerOptoutComponent} from 'src/app/dialogs/reseller-optout/reseller-optout.component';
import {ReselleroptindialogComponent} from 'src/app/dialogs/reselleroptindialog/reselleroptindialog.component';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';

@Component({
  selector: 'app-chasedetails',
  templateUrl: './chasedetails.component.html',
  styleUrls: ['./chasedetails.component.scss']
})
export class ChasedetailsComponent implements OnInit {
  is_RESELLER: string;
  public ChaseparamsData: BehaviorSubject<chaseParams[]> = new BehaviorSubject<chaseParams[]>([]);
  chaseparams = new chaseParams();
  result: any = [];
  id: String;
  details: Details;
  chaseDetails: ChaseDetails;
  detailsList: any;
  clicked: boolean = true;
  //Auto Renewal Id details
  autorenewId: string;
  mDate: any;
  autoRenewDate: any;
  LastNotification: string;
  status: string;
  tier1: string;
  tier2: string;
  tier: string;
  payer: string;
  promiseDate: any;
  displayPromiseDate: boolean;
  formatted_Date: string;
  promiseDateflag: boolean = true;
  poSubmitVisible: string;
  loadingOverlayFlag: boolean = false;
  t1soldto: any;
  lastNotificationdate: string;
  freezedate: any;
  promiseflags: boolean;
  Freezedateflags: boolean = true;
  formatted_date: string;
  porequired: string;
  status_name: any;
  auditResult: any;
  tierNameType:string;
  subscription: Subscription;
  constructor(public service: AutorenewService,public globalDateFormat: globalDateFormat, private datePipe: DatePipe, public router: Router, public ngZone: NgZone, private dialog: MatDialog, private route: ActivatedRoute) {
    this.chaseDetails = new ChaseDetails();
    this.chaseparams = new chaseParams()
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.t1soldto = params['t1soldto'];
      this.getchasedetails(this.id);
      this.getAudit(this.id);
    });
    this.sendMessage();
    // this.sendAuditMessage();
    this.subscription = this.service.getTierType().subscribe(tierType => {
      this.tierNameType=tierType ;
      console.log("this.tierNameType"+this.tierNameType)
  })
}

  get data(): chaseParams[] {
    return this.ChaseparamsData.value;

  }
  gotoDashboard() {
    let pathurl = sessionStorage.getItem('tab');
    if (pathurl) {
      this.router.navigate(['/' + pathurl]);
    } else {
      this.router.navigate(['/autorenewdashboard']);
    }
  }

  getchasedetails(id: any) {
    this.loadingOverlayFlag = true;
    this.service.getchasedetails(id).subscribe(
      data => {
        this.result = data;

        this.is_RESELLER = data["is_RESELLER"];
        this.service.setARID(this.result.autorenew_id)
        this.service.sendNewMessage(this.result, this.t1soldto);
        this.loadingOverlayFlag = false;
        this.autorenewId = this.result.autorenew_id;
        this.LastNotification = this.result.previous_reminder_date;
        this.autoRenewDate = this.result.auto_renewal_date;
        this.freezedate = this.result.freeze_auto_renewal_date;
        this.tier1 = this.result.tier1;
        this.tier2 = this.result.tier2;
        this.tier = this.result.tier;
        this.payer = this.result.payer;
        this.status = this.result.statusId;
        this.status_name = this.result.statusName;
        let current_datetime = new Date()
        this.formatted_Date = this.datePipe.transform(current_datetime, 'yyyy-MM-dd');
        this.formatted_date = moment(current_datetime).format('MM/DD/YYYY');
        this.promiseDate = this.result.promise_date;
        this.displayPromiseDate = this.result.status_id != "6" ? true : false
        // let popromise_date = this.datePipe.transform(this.promiseDate, 'yyyy-MM-dd')
        let userTypes = {"is_RESELLER": data["is_RESELLER"], "is_DISTRIBUTOR": data["is_DISTRIBUTOR"]}
        sessionStorage.setItem('userType', JSON.stringify(userTypes));

        let popromise_date = moment(this.promiseDate).format('MM/DD/YYYY');

        if (this.promiseDate < this.formatted_date) {
          this.promiseDateflag = true;

        }
        else {
          this.promiseDateflag = false;

        }
        this.porequired = this.result.po_required;
        this.poSubmitVisible = this.result.po_SUBMIT_VISIBLE;
        this.mDate = moment(this.result.auto_renewal_date).format('YYYY/MM/DD');
        this.lastNotificationdate = moment(this.result.previous_reminder_date).format('YYYY/MM/DD');
        if (this.freezedate >= this.formatted_Date) {
          this.Freezedateflags = false;
        }
        else {
          this.Freezedateflags = true;

        }
        if (this.autoRenewDate >= this.formatted_Date) {
          this.promiseflags = false;
        }
        else {
          this.promiseflags = true;
        }
      },
      error => { },
      () => { }
    )

  }

  optoutDialog() {
    // this.dialog.open(OptoutdialogComponent);
    let dialogRef = this.dialog.open(OptoutdialogComponent, {
      data: this.result
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id)
    });

  }
  posubmitDialog() {
      let dialogRef = this.dialog.open(DashposubmitComponent, {
      data: this.result,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id)
    });
  }
  resellerposubmitDialog() {
     let dialogRef = this.dialog.open(ResellersubmitComponent, {
      data: this.result,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id)
    });
  }
  resellerOptoutDialog(){
    let dialogRef = this.dialog.open(ResellerOptoutComponent, {
      data: this.result,
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id)
    });  
  }
  changepayerDialog() {
    // this.dialog.open(ChangepayerdialogComponent);
    let dialogRef = this.dialog.open(DashchangepayerComponent, {
      data: this.result
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id)
    });
  }
  masterpopromiseDialog() {
    // this.dialog.open(PopromisedialogComponent, {
    // });
    let dialogRef = this.dialog.open(PopromisedialogComponent, {
      data: this.result
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id);

    });
  }
  optinDialog() {
    // this.dialog.open(OptindialogComponent);
    let dialogRef = this.dialog.open(OptindialogComponent, {
      data: this.result
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id);
    });
  }
  resellerOptinDialog(){
    let dialogRef = this.dialog.open(ReselleroptindialogComponent, {
      data: this.result
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getchasedetails(this.id);
    });
  }
  public sendMessage() {
    this.service.sendNewMessage(this.result, this.t1soldto);
  }

  getAudit(id: any) {
    this.service.getAudit(id).subscribe(
      Data => {
        this.auditResult = Data;
        this.service.sendAuditMessage(this.auditResult, this.t1soldto);
      })
  }
  public sendAuditMessage() {
    this.service.sendAuditMessage(this.auditResult, this.t1soldto);
  }
}


import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from '../../shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { environment } from '../../../environments/environment.dev';
import { DataSource } from '@angular/cdk/collections';
import { VERSION, MatDialog, MatDialogRef } from '@angular/material';
import { DetailsOptinComponent } from '../../dialogs/details-optin/details-optin.component';
import { DetailsoptoutComponent } from '../../dialogs/detailsoptout/detailsoptout.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ChasedetailsComponent } from "../chasedetails/chasedetails.component";
import { DetailsPoSubmitDialogComponent } from '../../dialogs/details-po-submit-dialog/details-po-submit-dialog.component';
import { DetailsResellerDialogComponent } from '../../dialogs/details-reseller-dialog/details-reseller-dialog.component';
import { DetailsResellerOptoutComponent } from '../../dialogs/details-reseller-optout/details-reseller-optout.component';
import { DetailsreselleroptindialogComponent } from '../../dialogs/detailsreselleroptindialog/detailsreselleroptindialog.component';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';
export interface QuoteData {
  quote_id: string;
  expiring_contractnumber: string;
  contract_expiry_date: string;
  total_contract_value: string;
  is_promotion_applied: string;
  quote_status_name: string;
}

@Component({
  selector: 'app-requestdetails',
  templateUrl: './requestdetails.component.html',
  styleUrls: ['./requestdetails.component.scss'],

})
export class RequestdetailsComponent implements OnInit, OnDestroy {
  is_RESELLER: string = "N";
  displayedColumns = ['quote_id', 'expiring_contractnumber', 'contract_expiry_date', 'total_contract_value', 'End_Customer_Name', 'Quote_status', 'is_promotion_applied', 'quote_status_name'];
  public quote_data: QuoteData[];
  loadingOverlayFlag: boolean = false;
  poSubmitVisible: string;
  porequired: string;
  subscription: Subscription;
  public quotedata: any[] = [];
  promiseflags: boolean = true;
  Freezedateflags: boolean = true;
  formatted_date: string;
  freezeautorenewaldate: string;
  newautodate: string;
  newfreezedate: string;
  posubmitflag: boolean;
  result: any;
  id: string;
  tierNameType: string;
  quoteslist: any;
  isTierFlag: boolean;
  dataSource = new MatTableDataSource<QuoteData>(this.quotedata);
  @Input() sendMessage
  selection = new SelectionModel<QuoteData>(true, []);
  auto_renewal_date: any;
  autorenewalFlag: boolean;
  apiQuoteUrl = environment.ApiQuoteEndPint;
  apiContractUrl = environment.ApiContractEndPoint;
  constructor(public service: AutorenewService, private globalDateFormat: globalDateFormat, private datePipe: DatePipe, public dialog: MatDialog, public chasedetailsComponent: ChasedetailsComponent) { }

  ngOnInit() {
    //this.loadingOverlayFlag=true;
    this.subscription = this.service.getmessage().subscribe(message => {
      console.log("message => ", message)
      this.is_RESELLER = message.is_RESELLER;
      this.poSubmitVisible = message.po_SUBMIT_VISIBLE;
      this.porequired = message.po_required;

      if (this.poSubmitVisible == 'Y') {
        this.posubmitflag = false;
      } else {
        this.posubmitflag = true;
      }
      this.subscription = this.service.getTierType().subscribe(tierType => {
        let localTierName: string;
        // this.tierNameType = tierType;
        if (tierType == undefined) {
          localTierName = sessionStorage.getItem('tierNameType')
          console.log("localTierName ==>", localTierName)
          if (localTierName != undefined || localTierName != null) {
            this.tierNameType = localTierName;
          }
        }
        else {
        sessionStorage.setItem('tierNameType', tierType)
          this.tierNameType = tierType;
        }
        console.log("this.tierNameType ==> " + this.tierNameType)
      })
      this.freezeautorenewaldate = message.freeze_auto_renewal_date;
      this.auto_renewal_date = message.auto_renewal_date
      let current_datetime = new Date()
      // this.formatted_date = this.datePipe.transform(current_datetime, 'yyyy-MM-dd');
      this.formatted_date = moment(current_datetime).format('YYYY-MM-DD');
      // this.newfreezedate=this.datePipe.transform(this.freezeautorenewaldate,'yyyy-MM-dd');
      // this.newautodate=this.datePipe.transform(this.auto_renewal_date ,'yyyy-MM-dd');


      if (this.freezeautorenewaldate >= this.formatted_date) {

        this.Freezedateflags = false;
      }
      else {

        this.Freezedateflags = true;

      }
      if (this.auto_renewal_date >= this.formatted_date) {
        this.autorenewalFlag = false;
      } else {
        this.autorenewalFlag = true;
      }
      this.quotedata = message.quoteList;
      this.quoteslist = message.quoteList;
      if (message.quoteList != null || message.quoteList != undefined) {
        message.quoteList.forEach(element => {

          if ((element.is_eligible == 'Y' && this.tierNameType == 'T1') || (element.is_eligible == 'Y' && this.tierNameType == null)) {
            this.isTierFlag = true;
            console.log("this.isTierFlag:::" + this.isTierFlag)
          }

        });
      }
      // this.data = this.quotedata;
    });

  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cellClicked(element) {
    this.displayedColumns.push(element.quote_id, element.expiring_contractnumber, element.contract_expiry_date, element.total_contract_value, element.is_promotion_applied, element.quote_status_name);
  }

  detailsoptoutDialog(element: any) {
    let dialogRef = this.dialog.open(DetailsoptoutComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }
  detailsResellerOptoutDialog(element: any) {
    let dialogRef = this.dialog.open(DetailsResellerOptoutComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }

  posubmitDialog(element: any) {
    let dialogRef = this.dialog.open(DetailsPoSubmitDialogComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }
  resellerposubmitDialog(element: any) {
    let dialogRef = this.dialog.open(DetailsResellerDialogComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }
  detailsreselleroptinDialog(element) {
    let dialogRef = this.dialog.open(DetailsreselleroptindialogComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }

  detailsoptinDialog(element: any) {
    let dialogRef = this.dialog.open(DetailsOptinComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.chasedetailsComponent.getchasedetails(element.autorenew_id)
    });
  }

  isAllSelected() {
    if (this.quotedata != undefined) {
      const numSelected = this.selection.selected.length;
      const numRows = this.quotedata.length;
      return numSelected === numRows;
    }
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.quotedata.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: QuoteData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.quote_id + 1}`;
  }
  goToQuotes(element) {
    window.open(this.apiQuoteUrl + element.quote_id + '/existing');
  }
  goToContracts(element) {
    window.open(this.apiContractUrl + element.expiring_contractnumber + '/contract')
  }
}

export interface Element {
  close?: boolean;
}

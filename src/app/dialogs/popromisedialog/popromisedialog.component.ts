import { Component, OnInit, Inject, Input } from "@angular/core";
import { DatePipe } from '@angular/common';
import { MatSnackBar, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { AutorenewService } from '../../services/autorenew.service';
import { LoaderService } from '../../services/loader.service';
import { formatDate } from "@angular/common";
import * as moment from 'moment';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import { globalDateFormat } from '../../../config/date-format-config';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-popromisedialog',
  templateUrl: './popromisedialog.component.html',
  styleUrls: ['./popromisedialog.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class PopromisedialogComponent implements OnInit {
  loadingOverlayFlag: boolean = false;
  futureDate = moment(new Date()).add(1, 'days');
  minDate = this.futureDate.format('YYYY-MM-DD');
  maxDate: any;
  promiseflag: any;
  promiseflagdate: any;
  optInFlag:boolean;
  optOutFlag:boolean;
  // date = new FormControl(new Date());
  // serializedDate = new FormControl((new Date()).toISOString());
  public isCollapsed = {};
  public allItems = [{}];
  public quotesDetails: any;
  public selectedDate: any;
  public selecteddate: any;
  defaultChecked = true;
  promiseErrorflag: boolean = false;
  currentdate = new Date();
  formatted_date: string;
  selectedDateFormat: string;
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  tier1: string;
  tier2: string;


  constructor(private datePipe: DatePipe, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,public globalDateFormat: globalDateFormat,
    public dialogRef: MatDialogRef<PopromisedialogComponent>,
    public service: AutorenewService, public loader: LoaderService) {
  }

  ngOnInit() {
    this.quotesList();
    let maxdate: any = moment(new Date(this.data.auto_renewal_date)).toDate();
    this.maxDate = moment(maxdate - 1).format('YYYY-MM-DD');
    if (this.data.previous_reminder_date != null && this.data.updatedOn != null) {
      this.data.previous_reminder_date = moment(this.data.previous_reminder_date).format('MM/DD/YYYY');
      this.data.updatedOn = moment(this.data.updatedOn).format('MM/DD/YYYY')
    }

    if (this.data.t1name || this.data.t2name) {
      this.tier1 = this.data.t1name;
      this.tier2 = this.data.t2name;
    } else {
      this.tier1 = this.data.tier1;
      this.tier2 = this.data.tier2;
      for (let j = 0; j <= this.tier2.length; j++) {
        if (this.tier2.charAt(j) == '&') {

          let str1: any;
          let str2: any;
          str1 = this.tier2.slice(0, j);
          str2 = this.tier2.slice(j + 5, this.tier2.length);
          let moifiedvariable = str1 + '&' + str2;
          this.tier2 = moifiedvariable;

        }
      }
      for (let j = 0; j <= this.tier1.length; j++) {
        if (this.tier1.charAt(j) == '&') {

          let str1: any;
          let str2: any;
          str1 = this.tier1.slice(0, j);
          str2 = this.tier1.slice(j + 5, this.tier1.length);
          let moifiedvariable = str1 + '&' + str2;
          this.tier1 = moifiedvariable;

        }
      }
    }

  }
  confirmpopromise() {

  }

  checkboxLabel(row) { }

  poPormiseSubmit() {
    this.loadingOverlayFlag = true;
    this.selectedDateFormat = moment(this.selectedDate).format('YYYY-MM-DD');
    var chaseId = this.data.autorenew_id;
    var auto_renewal_date = this.data.auto_renewal_date;
    // let autodate = this.datePipe.transform(auto_renewal_date, 'yyyy-MM-dd');
    // let selecteddateFormat = this.datePipe.transform(this.selectedDateFormat, 'yyyy-MM-dd')
    let autodate = moment(auto_renewal_date).format('YYYY-MM-DD');
    let selecteddateFormat = moment(this.selectedDateFormat).format('YYYY-MM-DD');
    if (autodate <= selecteddateFormat) {
      this.snackbar.open('You cannot promise at Auto-Renewal Date or beyond', 'Close', {
        duration: 10000, verticalPosition: 'top',
        panelClass: ['warning']
      });
    }
    else {
    }

    this.service.poPromiseService(chaseId, this.selectedDateFormat).subscribe((response: any) => {
      this.loadingOverlayFlag = false;
      this.dialogRef.close();
      window.location.reload();
    },
      (err) => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
      });
  }

  Cancel() {
    this.dialogRef.close();
  }

  quotesList() {
    this.loadingOverlayFlag = true;
    var chaseId = this.data.autorenew_id;
    this.service.chaseDetails(chaseId).subscribe(
      data => {
        this.loadingOverlayFlag = false;
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          this.quoteDetails.push(element);
          // this.quoteDetails.forEach(element => {
          //   element.checked = true;
          //   // this.selectquoteid.push(element.quote_id);
          // });
        });

        this.quoteDetails.forEach(element => {
          if (element.quote_sub_status == '6') {
            this.optInFlag = true;
          } else {
            this.optInFlag = false;
          }
          if (element.quote_sub_status == '5' || element.quote_sub_status == '7') {
            this.optOutFlag = true;
          } else {
            this.optOutFlag = false;
          }
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
        });
      },
      error => {
        this.loadingOverlayFlag = false;
      },
      () => { }
    );
  }
}

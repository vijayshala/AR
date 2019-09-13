import { Component, OnInit, Inject, Input, ViewEncapsulation } from "@angular/core";
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { LoaderService } from '../../services/loader.service';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import { DataSource } from '@angular/cdk/collections';
import { element } from '@angular/core/src/render3';
import { AutorenewdetailsComponent } from 'src/app/components/autorenewdetails/autorenewdetails.component';
import { AutorenewDashboardComponent } from 'src/app/components/autorenew-dashboard/autorenew-dashboard.component';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-reseller-optout',
  templateUrl: './reseller-optout.component.html',
  styleUrls: ['./reseller-optout.component.scss']
})
export class ResellerOptoutComponent implements OnInit { loadingOverlayFlag: boolean = false;
  reason_codes: any = [];
  public isCollapsed = {};
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  selectAllFlag: boolean = true;
  public allItems = [
    {
      checked: true,
      chaseID: "CHD4123456",
      Tier1: "Tier1",
      Tier2: "Tier2",
      payer: "payer 1",
      lastNotificationDate: "12/09/2019",
      modifiedDate: "12/10/2019",
      total: "$200.00",
      quote_id: "Q-123456",
      contractnumber: "543210"
    }
  ];
  public selectedReason: any;
  public selectedComment: any;
  public selectedComments: any;
  defaultChecked = true;
  multiQuoteForm: FormGroup;
  public optRequest = {};
  selectquoteid: any = [];
  subdisplayedColumns: string[] = [
    "select",
    "quote_id",
    "expiring_contractnumber",
    "contract_expiry_date",
    "includePromotion",
    "quoteSubStatusName",
    "total_contract_value",
    "Quote_status"
  ];
  selection = new SelectionModel<QuoteDetails>(true, []);
  dataSource: any;
  disabledstatus: boolean = false;
  quotelist: any = [];
  selectedeventpopup: boolean;
  allquoteList: any;
  result: any;
  tier1: string;
  tier2: string;

  constructor(private fb: FormBuilder,public globalDateFormat: globalDateFormat,
    public dialogRef: MatDialogRef<ResellerOptoutComponent>,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public service: AutorenewService,
    public loader: LoaderService) { 
      this.reason_codes = [
        "Intend to cancel",
        "Contract Consolidation",
        "Scope change – need to include additional assets",
        "Equipment on site to Cloud (CapEx to OpEx)"
      ];
    }

  ngOnInit() {
    this.quotesList(this.data.autorenew_id);
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
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  selectAll(value: any) {
    if (!value) {
      this.quoteDetails.forEach(element => {
        element.checked = false
      })
    } else {
      this.quoteDetails.forEach(element => {
        if (element.quote_sub_status == '6' || element.quote_sub_status == '8' || element.is_eligible == 'N'
        ) {
          element.checked = false;
        }
        else {
          element.checked = true
        }
      })
    }
  }


  quotesList(id: any) {
    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      // this.service.demoService().subscribe(
      data => {
        this.result = data;
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          if (this.quoteDetails.indexOf(element.quote_id) === -1) {
            this.quoteDetails.push(element);
          }
        });
        this.quoteDetails.forEach(element => {
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
        });
      },
      error => { },
      () => {
        var checkboxFlag = [];
        this.quoteDetails.forEach(element => {
          if (element.is_eligible === 'N' || element.quote_sub_status == "6" || element.quote_sub_status == "8") element.checked = false;
          else element.checked = true;
          if (element.quote_sub_status == "6") this.disabledstatus = true;
          if (element.checked == true) checkboxFlag.push(element);
          // if (element.quote_sub_status == "8") {
          //   element.checked = false;
          // }
          // if (checkboxFlag.length > 0) {

          //   this.selectAllFlag = true;

          // }
          // else {

          //   this.selectAllFlag = false;
          // }
          this.selectAllFlag = checkboxFlag.length > 0 ? true : false;
        });

        this.loadingOverlayFlag = false;
      }
    );
  }

  onChangeCheckbox(quoteId: any, isChecked: any) {
    var checkboxFlag = [];
    if (isChecked == true) {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) element.checked = true;
      });
    } else {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) element.checked = false;
      });
    }
    this.quoteDetails.forEach(element => {
      if (element.checked == true && element.quote_sub_status != '6') checkboxFlag.push(element);
      if (checkboxFlag.length > 0) {
        this.selectAllFlag = true;
      }
      else { this.selectAllFlag = false };

    })

  }


  onChange(quoteId: any, isChecked: any) {
    if (isChecked == true) {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) {
          element.checked = true;
          if (this.selectquoteid.indexOf(element.quote_id) === -1) {
            this.selectquoteid.push(element.quote_id);
          }
        }
      });
    } else {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) {
          element.checked = false;
          this.selectquoteid = this.selectquoteid.filter(item => item !== element.quote_id)
        }
      });
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  optout() {
    this.loadingOverlayFlag = true;
    var quoteCount = [];
    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        if (element.checked) quoteCount.push(element.quote_id);
        if (element.checked && element.quote_sub_status != '6' && element.quote_sub_status != '4' && element.quote_sub_status != '8') {
          if (this.quotelist.indexOf(element.quote_id) === -1) {
            this.quotelist.push(element.quote_id);
          }
        }
        else {
          this.quotelist = this.quotelist.filter(item => item !== element.quote_id)
        }
      })
      if (this.selectedComment != null) {
        this.selectedComments = this.selectedComment;
      } else {
        this.selectedComments = " ";
      }
      this.optRequest = {
        "optlist": [
          {
            "autorenewId": this.data.autorenew_id,
            "quoteIdList": this.quotelist
          }
        ],
        "reason": this.selectedReason,
        "comment": this.selectedComments
      }
      this.optinServiceCall(this.optRequest);

    }
    console.log("this.quotelist", this.quotelist);
  }

  optinServiceCall(request) {
    var chaseId = this.data.autorenew_id;
    this.service.optOutService(chaseId, request).subscribe(
      data => {
        this.loadingOverlayFlag = false;
         window.location.reload();
      },
      error => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
      },
      () => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
      }
    );
  }


  checkAllField() {
    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        if (element.checked && element.is_eligible !== 'N' && (element.quote_sub_status == '5' || element.quote_sub_status == '7')) {
          if (this.quotelist.indexOf(element.quote_id) === -1) this.quotelist.push(element.quote_id);
        }
        else this.quotelist = this.quotelist.filter(item => item !== element.quote_id);
      })
    }
    if (this.quotelist.length > 0) return false;
    else return true;
  }

  cancel() {
    this.dialogRef.close();
  }

  popUpMethod(event, selectedReason) {
    if (selectedReason != "Intend to cancel") {
      return
    }
    this.allquoteList = this.result.length;
    if (this.allquoteList > 1) {
      this.quoteDetailsObj.forEach(element => {
        if (this.quoteDetails.indexOf(element.quote_id) === -1) {
          this.quoteDetails.push(element);
        }
        this.quoteDetails.forEach(element => {
          if (element.quote_sub_status == '7' || element.quote_sub_status == '5') {
            this.snackBar.open('Warning: non-renewal may result in fragmented coverage and re-initiation fees when reinstating coverage', 'Close', {
              duration: 30000, verticalPosition: 'top',
              panelClass: ['warning']
            });
          }
          else {
            this.selectedeventpopup = false;

          }
        })
      })
    }
  }
}

import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { AutorenewService } from '../../services/autorenew.service';
import { LoaderService } from '../../services/loader.service';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-optindialog',
  templateUrl: './optindialog.component.html',
  styleUrls: ['./optindialog.component.scss']
})
export class OptindialogComponent implements OnInit {
  loadingOverlayFlag: boolean = false;
  public isCollapsed = {};
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  public allItems = [
    { checked: true, chaseID: "CHD43123456", Tier1: "Tier1", Tier2: "Tier2", payer: "payer 1", lastNotificationDate: "12/08/2019", modifiedDate: "12/09/2019", total: "$200.00", quote_id: "Q-123456", contractnumber: "7326452" }
  ]
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
  quotesDetails: any;
  selection = new SelectionModel<QuoteDetails>(true, []);
  dataSource: any;
  defaultChecked = true;
  multiQuoteForm: FormGroup;
  public optRequest = {};
  disabledstatus: boolean;
  selectquoteid: any = [];
  quotelist: any = [];
  selectAllFlag: boolean = true;
  selectAllFlagDisable: boolean = true;
  tier1: string;
  tier2: string;

  constructor(private fb: FormBuilder,  public globalDateFormat: globalDateFormat,private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<OptindialogComponent>, public service: AutorenewService, public loader: LoaderService) { }

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

  quotesList(id: any) {
    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      data => {
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          if (this.quoteDetails.indexOf(element.quote_id) === -1) this.quoteDetails.push(element);
        });
        this.quoteDetails.forEach(element => {
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
        });
      },
      error => { },
      () => {
        var checkboxFlag = [];
        this.quoteDetails.forEach(element => {
          if (element.is_eligible === 'N' || element.quote_sub_status != '6') {
            element.checked = false;
          }
          else {
            element.checked = true;
          }
          // if (element.quote_sub_status == "6") this.disabledstatus = true;
          if (element.checked == true) checkboxFlag.push(element);
          if (checkboxFlag.length > 0) {
            this.selectAllFlag = true;
            this.selectAllFlagDisable = true;
          }

          else {
            this.selectAllFlag = false;
            this.selectAllFlagDisable = false;
          }
          if (checkboxFlag.length > 0) {
            this.selectAllFlag = true;
          }

          else {
            this.selectAllFlag = false;
          }
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
      if (element.checked == true && element.quote_sub_status == '6') checkboxFlag.push(element);
      if (checkboxFlag.length > 0) {
        this.selectAllFlag = true;
        this.selectAllFlagDisable = true;
      }
      else {
        this.selectAllFlag = false;
        this.selectAllFlagDisable = false;
      }
    })

  }

  checkboxLabel(row?: QuoteDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
      } row ${row.quote_id + 1}`;
  }

  selectAll(value: any) {
    if (!value) {
      this.quoteDetails.forEach(element => {
        element.checked = false;
      })
    }
    else {
      this.quoteDetails.forEach(element => {
        if (element.is_eligible === 'N' || element.quote_sub_status != '6') {
          element.checked = false;
        }
        else {
          element.checked = true
        }
      })
    }
    
  }

  optin() {
    this.loadingOverlayFlag = true;
    var quoteCount = [];
    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        if (element.checked) quoteCount.push(element.quote_id);
        if (element.checked && element.is_eligible !== 'N' && element.quote_sub_status == '6') {
          if (this.quotelist.indexOf(element.quote_id) === -1) this.quotelist.push(element.quote_id);
        }
        else this.quotelist = this.quotelist.filter(item => item !== element.quote_id)
      })

      this.optRequest = {
        "optlist": [
          {
            "autorenewId": this.data.autorenew_id,
            "quoteIdList": this.quotelist
          }
        ],
      }
      this.optinServiceCall(this.optRequest);

    }
  }

  optinServiceCall(request) {
    var chaseId = this.data.autorenew_id;
    this.service.optInService(chaseId, request).subscribe(
      data => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
        window.location.reload();
      },
      error => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
      },
      () => {
        this.loadingOverlayFlag = false;
        // this.dialogRef.close();
      }
    );
  }

  checkAllField() {
    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        if (element.checked && element.is_eligible !== 'N' && element.quote_sub_status == '6') {
          if (this.quotelist.indexOf(element.quote_id) === -1) this.quotelist.push(element.quote_id);
        }
        else this.quotelist = this.quotelist.filter(item => item !== element.quote_id);
      })
    }
    if (this.quotelist.length > 0) return false;
    else return true;
  }

  Cancel() {
    this.dialogRef.close();
  }
}

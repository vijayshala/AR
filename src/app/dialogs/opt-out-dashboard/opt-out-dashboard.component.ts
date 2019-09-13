import { Component, OnInit, Inject, Input } from "@angular/core";
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
  selector: 'app-opt-out-dashboard',
  templateUrl: './opt-out-dashboard.component.html',
  styleUrls: ['./opt-out-dashboard.component.scss']
})
export class OptOutDashboardComponent implements OnInit {
  loadingOverlayFlag: boolean = false;
  reason_codes: any = [];
  public isCollapsed = {};
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  selectedComments: any;

  public allItems: any = [];

  public selectedReason: any;
  public selectedComment: any;
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
    "total_contract_value"
  ];
  selection = new SelectionModel<QuoteDetails>(true, []);
  dataSource: any;
  disabledstatus: boolean = false;
  quotelist: any = [];
  public autoRenewList: any = [];
  public disabledAutorenewCheckbox: boolean = false;
  public disabledSubmitButton: boolean = true;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OptOutDashboardComponent>,
    private datePipe: DatePipe,
    public globalDateFormat: globalDateFormat,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public service: AutorenewService,
    public loader: LoaderService,
  ) {
    this.reason_codes = [
      "Intend to cancel",
      "Contract Consolidation",
      "Scope change – need to include additional assets",
      "Equipment on site to Cloud (CapEx to OpEx)"
    ];
  }

  ngOnInit() {
    this.allItems = this.data;
    var autorenewList = [];
    this.allItems.forEach(element => {
      autorenewList.push(element.autorenew_id);
      element.checked = true
    });

    this.service.getMasterAutorenewList(autorenewList).subscribe(list => {
      this.autoRenewList = list;
      var count = [];
      this.autoRenewList.forEach(element => {
        element.checked = true;
        if (element.quoteList.length > 0) {
          var selectedQuoteList = [];
          element.quoteList.forEach(element => {
            if (element.quote_sub_status == '6' || element.quote_sub_status == '8' || element.is_eligible == 'N') {
              element.checked = false;
            }
            else {
            element.checked = true;

            }
          })
        }
      });

      this.autoRenewList.filter(item => {
        var filteredQuotes = item.quoteList.filter(quote => quote.is_eligible !== 'N' && (quote.quote_sub_status == "5" || quote.quote_sub_status == "7"))

        var length = filteredQuotes.length;
        item["validQuoteList"] = filteredQuotes.length;
        if (length > 0) {
          count.push(length);
          item.checked = true;
        }
        else item.checked = false;
      });
      if (count.length > 0) this.disabledSubmitButton = false;
      else this.disabledSubmitButton = true;
    });
  }

  ngOnDestroy() {
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

  checkboxLabel(row?: QuoteDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(row) ? "deselect" : "select"
      } row ${row.quote_id + 1}`;
  }
  selectAll(value: any, records: any, index) {
    if (!value) {
      records.quoteList.forEach(element => {
        element.checked = false
      })
    } else {
      records.quoteList.forEach(element => {
        if (element.quote_sub_status == '6' || element.quote_sub_status == '8' || element.is_eligible == 'N'
        ) {
          element.checked = false;
        }
        else {
          element.checked = true;
        }
      })
    }
    this.vallidSubmitButton();
  }

  // selectAll(value: any, records: any, index) {
  //   if (value == true) {
  //     records.quoteList.forEach(element => {
  //       // element.checked = true
  //       if (element.is_eligible === 'Y' || element.quote_sub_status == '5' || element.quote_sub_status == '7') element.checked = true;
  //       else element.checked = false
  //     })
  //   } else {
  //     records.quoteList.forEach(element => {
  //       element.checked = false;
  //     }) 
  //   }
  //   this.vallidSubmitButton();
  // }

  onChange(quoteId: any, isChecked: any) {
    if (isChecked == true) {
      this.autoRenewList.forEach(autorenew => {
        autorenew.quoteList.forEach(element => {
          if (element.quote_id == quoteId) {
            autorenew.checked = true;
            element.checked = true;
            if (this.selectquoteid.indexOf(element.quote_id) === -1) {
              this.selectquoteid.push(element.quote_id);
            }
          }
        });
      });
    } else {
      this.autoRenewList.forEach(autorenew => {
        if (autorenew.quoteList.length > 0) {
          autorenew.quoteList.forEach(element => {
            if (element.quote_id == quoteId) {
              element.checked = false;
            }
          });
          var selectedQuoteList = autorenew.quoteList.filter(item => item.checked == true)
          if (selectedQuoteList.length > 0) { }
          else autorenew.checked = false;

        }
        else {
          autorenew.checked = false;
        }

      });
    }
    this.vallidSubmitButton();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  optout() {
    this.loadingOverlayFlag = true;
    var quoteCount = [];
    var autorenewLists = [];
    var quoteList = [];
    var optList = []
    if (this.autoRenewList && this.autoRenewList.length > 0) {
      this.autoRenewList.forEach(autorenew => {
        if (autorenew.checked) {
          autorenew.quoteList.forEach(quote => {
            if (quote.checked && (quote.quote_sub_status == '5' || quote.quote_sub_status == '7')) {
              quoteList.push(quote.quote_id)
              autorenewLists["quoteList"] = quoteList
            }
            else {
              quoteList = quoteList.filter(item => item !== quote.quote_id)
            }
          })
          optList.push({ "autorenewId": autorenew.autorenew_id, "quoteIdList": quoteList })
          quoteList = [];
        }
        else {
          autorenewLists = this.autoRenewList.filter(item => item !== autorenew.autorenew_id)
        }
        var optoutFinalList = [];
      })
      if (this.selectedComment != null) {
        this.selectedComments = this.selectedComment;
      } else {
        this.selectedComments = " ";
      }
      this.optRequest = {
        "optlist": optList,
        "reason": this.selectedReason,
        "comment": this.selectedComments
      }
      console.log("this.optRequest", this.optRequest)

      // this.optRequest.optlist.push()
      this.optinServiceCall(this.optRequest);

    }
  }

  optinServiceCall(request) {
    var chaseId = this.data.autorenew_id;
    this.service.optOutService(chaseId, request).subscribe(
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
        this.dialogRef.close();
      }
    );
  }

  checkAllField() {
    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        if (element.checked && (element.quote_sub_status == '5' || element.quote_sub_status == '7')) {
          if (this.quotelist.indexOf(element.quote_id) === -1) {
            this.quotelist.push(element.quote_id);
          }
        }
        else {
          this.quotelist = this.quotelist.filter(item => item !== element.quote_id)
        }
      })
    }
    if (this.quotelist.length > 0) return false;
    else return true;
  }

  cancel() {
    this.dialogRef.close();
  }
  popupmethod(event, selectedReason) {
    if (selectedReason != "Intend to cancel") {
      return
    }
    this.autoRenewList.forEach(autorenew => {
      if (autorenew.quoteList.length > 1) {
        autorenew.quoteList.forEach(element => {
          if (element.quote_sub_status == '7' || element.quote_sub_status == '5') {
            this.snackBar.open('Warning: non-renewal may result in fragmented coverage and re-initiation fees when reinstating coverage', 'Close', {
              duration: 40000, verticalPosition: 'top',
              panelClass: ['warning']
            })
          }
        })


      }
    })

  }

  vallidSubmitButton() {
    // For disable the submit button if Nothing Valid checked
    let count = [];
    this.autoRenewList.filter(item => {
      if (item.checked == true) count.push(item);
    });
    if (count.length > 0) this.disabledSubmitButton = false;
    else this.disabledSubmitButton = true;
  }
}

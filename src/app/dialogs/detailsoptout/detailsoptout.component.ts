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
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-detailsoptout',
  templateUrl: './detailsoptout.component.html',
  styleUrls: ['./detailsoptout.component.scss']
})
export class DetailsoptoutComponent implements OnInit {
  id: any;
  public selectedReason: any;
  subscription: Subscription;
  chasedetails: any[] = [];
  loadingOverlayFlag: boolean = false;
  public isCollapsed = {};
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  quotesdata: any;
  public selectedComment: any;
  public selectedComments: any;
  public allItems = [
    { checked: true, chaseID: "CHD43123456", Tier1: "Tier1", Tier2: "Tier2", payer: "payer 1", lastNotificationDate: "12/08/2019", modifiedDate: "12/09/2019", total: "$200.00", quote_id: "Q-123456", contractnumber: "7326452" }
  ]
  subdisplayedColumns: string[] = [
    "quote_id",
    "expiring_contractnumber",
    "contract_expiry_date",
    "includePromotion",
    "quoteSubStatusName",
    "total_contract_value",
    "quote_status"
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
  quoteList: any;
  result: any = [];
  reason_codes: any = [];
  autorenew_Id: String;
  constructor(private fb: FormBuilder, public router: Router, private route: ActivatedRoute,
    private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,public globalDateFormat: globalDateFormat,
    public dialog: MatDialog, public dialogRef: MatDialogRef<DetailsoptoutComponent>,
    public service: AutorenewService, public loader: LoaderService) {
    this.reason_codes = [
      "Intend to cancel",
      "Contract Consolidation",
      "Scope change – need to include additional assets",
      "Equipment on site to Cloud (CapEx to OpEx)"
    ];
  }

  ngOnInit() {
    this.subscription = this.service.getmessage().subscribe(message => {
      this.chasedetails = message;
      this.id = message.autorenew_id;
      this.quoteList = message.quoteList;
      this.quotesList(this.id);
    })
  }

  quotesList(id: any) {
    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      data => {
        this.loadingOverlayFlag = false;
        this.result = data;
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = this.result;
        this.quoteDetailsObj.forEach(element => {
          if (element.quote_id === this.data.quote_id) {
            this.quoteDetails.push(element);
          }
        });
        this.quoteDetails.forEach(element => {
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
        });
      },
      error => {
        this.loadingOverlayFlag = false;
      },
    );
  }

  // onChange(quoteId: any, isChecked: any) {
  //   if (isChecked == true) {
  //     this.quoteDetails.forEach(element => {
  //       if (element.quote_id == quoteId) {
  //         element.checked = true;
  //         if (this.selectquoteid.indexOf(element.quote_id) === -1) {
  //           this.selectquoteid.push(element.quote_id);
  //         }
  //       }
  //     });
  //   } else {
  //     this.quoteDetails.forEach(element => {
  //       if (element.quote_id == quoteId) {
  //         element.checked = false;
  //         this.selectquoteid = this.selectquoteid.filter(item => item !== element.quote_id)
  //       }
  //     });
  //   }
  // }

  // optout() {
  //   this.loadingOverlayFlag = true;
  //   var quoteCount = [];
  //   if (this.quoteDetails && this.quoteDetails.length > 0) {
  //     this.quoteDetails.forEach(element => {
  //       if (element.checked) quoteCount.push(element.quote_id);
  //       if (element.checked && element.quote_sub_status != '6') {
  //         if (this.quotelist.indexOf(element.quote_id) === -1) {
  //           this.quotelist.push(element.quote_id);
  //         }
  //       }
  //       else {
  //         this.quotelist = this.quotelist.filter(item => item !== element.quote_id)
  //       }
  //     })
  //     if (this.quotelist && this.quotelist.length > 0 && quoteCount.length !== this.quoteDetails.length) {
  //       this.optRequest = {
  //         level: "quote",
  //         quote: this.quotelist,
  //         reason: this.selectedReason,
  //         comment: this.selectedComment
  //       }
  //     }
  //     else {
  //       this.optRequest = {
  //         level: "chase",
  //         reason: this.selectedReason,
  //         comment: this.selectedComment
  //       };
  //     }
  //   } else {
  //     this.optRequest = {
  //       level: "chase",
  //       reason: this.selectedReason,
  //       comment: this.selectedComment
  //     };
  //   }
  //   this.optinServiceCall(this.optRequest);
  // }


  optout() {
    this.loadingOverlayFlag = true;
    var quoteCount = [];

    if (this.quoteDetails && this.quoteDetails.length > 0) {
      this.quoteDetails.forEach(element => {
        this.quotelist.push(element.quote_id);
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
  cancel() {
    this.dialogRef.close();
  }
}



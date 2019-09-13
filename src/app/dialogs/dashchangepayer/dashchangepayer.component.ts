import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { LoaderService } from '../../services/loader.service';
import { Payer } from 'src/app/Model/payer';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PayeeDetails } from 'src/app/Model/payeedetails';
import * as moment from 'moment';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-dashchangepayer',
  templateUrl: './dashchangepayer.component.html',
  styleUrls: ['./dashchangepayer.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class DashchangepayerComponent implements OnInit {
  subscription: Subscription;

  public isCollapsed = {};
  public allItems = [
    { chaseID: "CHD76123456", Tier1: "Tier1", Tier2: "Tier2", payer: "102293220", lastNotificationDate: "08/12/2018", modifiedDate: "08/12/2019", total: "$200.00", quote_id: "Q-123456", contractnumber: "6747333", status_name: "Name1" },
  ]
  payers: any = [];
  chaseDetails: ChaseDetails;
  @Input() singleChildRowDetail: boolean;
  private openedRow: CdkDetailRowDirective;
  selection = new SelectionModel<ChaseDetails>(true, []);
  loadingOverlayFlag: boolean = false;
  subdisplayedColumns = ['select', 'quote_id', 'contractnumber'];
  displayedColumns = ['chase_id', 't1linkid', 't2linkid', 'payer', 'next_event_date', 'modified_date', 'total_contract_value', 'expandCollapse'];
  dataSource = [];
  public quotesDetails: any;
  defaultChecked = true;
  payer: Payer;
  newPayer: any;
  t1soldto: any;
  payeeDetails: Array<PayeeDetails>;
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  quotelist: any = [];
  tier1: string;
  tier2: string;
  optInFlag: boolean;
  optOutFlag: boolean;
  constructor(private snackBar: MatSnackBar, public globalDateFormat: globalDateFormat, public router: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<DashchangepayerComponent>, public service: AutorenewService, public loader: LoaderService) {
    this.chaseDetails = new ChaseDetails();
    this.chaseDetails = this.data;
    this.dataSource.push(this.data);
    this.payer = new Payer();
    this.payeeDetails = new Array<PayeeDetails>();
  }

  ngOnInit() {
    this.quotesList();
    this.listofPayer(this.chaseDetails.t1soldto, this.chaseDetails.autorenew_id);
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

  listofPayer(id: any, autoRenewId: any) {
    this.service.payerList(id, autoRenewId).subscribe(
      (data: any) => {
        this.payeeDetails = data.payeeDetails;
      }
    )
  }

  changePayer() {
    this.payeeDetails.forEach(element => {
      if (element.id == this.newPayer) {
        this.payer.newPayerName = element.name;
      }
    });
    this.payer.autoRenewId = this.data.autorenew_id;
    this.payer.oldPayerId = this.data.payer;
    this.payer.newPayerId = this.newPayer;
    this.loadingOverlayFlag = true;
    this.service.changePayerService(this.payer).subscribe(
      data => { },
      error => {
        this.loadingOverlayFlag = false;
        this.dialogRef.close();
      },
      () => {
        this.dialogRef.close();
        this.loadingOverlayFlag = false;
      }
    )
  }

  cancel() {
    this.dialogRef.close();
    // this.snackBar.open("You did not make any changes", "okay", {
    //   duration: 3000
    // });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: ChaseDetails): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.chase_id + 1}`;
  }

  onToggleChange(cdkDetailRow: CdkDetailRowDirective, row: Element): void {
    if (this.singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();
    }
    if (!row.close) {
      row.close = true;
    } else {
      row.close = false;
    }
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
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
export interface Element {
  close?: boolean;
}

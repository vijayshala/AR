import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { DataSource } from '@angular/cdk/collections';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
//dialogbox components
import { PopromisedialogComponent } from '../../dialogs/popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { OptindialogComponent } from '../../dialogs/optindialog/optindialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

import { orderhistoryComponent } from '../orderhistory/orderhistory.component';
import { LoaderService } from 'src/app/services/loader.service';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import * as moment from 'moment';
import { environment } from '../../../environments/environment.dev';
import { globalDateFormat } from '../../../config/date-format-config';
export interface QuotesData {
  quote_id: string;
  contractnumber: string;
  contract_exp_date: string;
  opt_in_out: string;
  price: string;

}

const ELEMENT_DATA: QuotesData[] = [
  // {quote_id: 'Q-423536', contractnumber: '2836827', contract_exp_date:'12/12/2020',opt_in_out: 'IN',price:'$100.00'},
  // {quote_id: 'Q-423536', contractnumber: '2836827', contract_exp_date:'12/12/2020',opt_in_out: 'IN',price:'$100.00'}

];
@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderdetailsComponent implements OnInit {
  subscription: Subscription;
  startDate: any;
  endDate: any;
  searchTerm: any;
  searchText: any
  id: String;
  apiQuoteUrl = environment.ApiQuoteEndPint;
  apiContractUrl = environment.ApiContractEndPoint;
  t1linkIdSearchValue: any;
  t2linkIdSearchValue: any;
  reseller_flag:string;
  displayedColumns = ['autorenew_id', 'email', 't1linkid', 't2linkid', 'payer', 'status_name', 'expandCollapse'];
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  subdisplayedColumns: string[] = ['quote_id', 'expiring_contractnumber', 'contract_expiry_date', 't1linkid', 't2linkid', 'includePromotion', 'quoteSubStatusName', 'total_contract_value'];
  dataSource1 = ELEMENT_DATA;

  @Input() singleChildRowDetail: boolean = true;
  private openedRow: CdkDetailRowDirective;
  public dataSource: customer_interaction_required | any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() parentCallEvent = new EventEmitter<any>();

  expandedElement: customer_interaction_required | null;
  selection = new SelectionModel<ChaseDetails>(true, []);
  quoteDetailsObj: any;
  quoteDetails: Array<QuoteDetails>;
  loadingOverlayFlag: boolean = false;
  eligible: boolean;
isResellerFlag:boolean;
  constructor(public orderhistory: orderhistoryComponent,public globalDateFormat: globalDateFormat,public service: AutorenewService, public router: Router,
    private dialog: MatDialog, public loader: LoaderService) {
    this.quoteDetails = new Array<QuoteDetails>();

  }

  ngOnInit() {
    this.dataSource = new customer_interaction_required(this.orderhistory, this.paginator);
    this.subscription = this.service.getstartDate().subscribe(startDate => {
      this.startDate = startDate;
    });
    this.subscription = this.service.getendDate().subscribe(enddate => {
      this.endDate = enddate;
    });
    this.subscription = this.service.getResellerFlag().subscribe(flag => {
      this.reseller_flag = flag;
      if(this.reseller_flag=='Y'){
       this.isResellerFlag=true;
      }
      else{
        this.isResellerFlag=false;
      }
         })
    this.subscription = this.service.getsearchText().subscribe(searchText => {
      this.searchText = searchText;
    });
  }

  getPaginationResult() {
    let searchText = ""
    let startDate = ""
    let endDate = ""
    let t1linkIdSearchValue = ""
    let t2linkIdSearchValue = ""
    this.orderhistory.pageSize = this.paginator.pageSize;
    this.orderhistory.pageNumber = this.paginator.pageIndex;
    let start_index = (this.paginator.pageIndex) * this.paginator.pageSize;
    this.parentCallEvent.next(start_index);

    if (this.orderhistory.searchTerm != undefined) {
      searchText = this.orderhistory.searchTerm
    }

    if (this.orderhistory.startDate != null &&
      this.orderhistory.endDate != null &&
      this.orderhistory.startDate != undefined &&
      this.orderhistory.endDate != undefined &&
      this.orderhistory.startDate != '' &&
      this.orderhistory.endDate != '') {
      startDate = this.orderhistory.startDate;
      endDate = this.orderhistory.endDate;
    }
    if (this.orderhistory.t1linkIdSearchValue && this.orderhistory.t1linkIdSearchValue != undefined) t1linkIdSearchValue = this.orderhistory.t1linkIdSearchValue;
    if (this.orderhistory.t2linkIdSearchValue && this.orderhistory.t2linkIdSearchValue != undefined) t2linkIdSearchValue = this.orderhistory.t2linkIdSearchValue;
    this.orderhistory.getCheseData(this.paginator.pageIndex, this.paginator.pageSize, startDate, endDate, searchText, t1linkIdSearchValue,
      t2linkIdSearchValue)
  }

  onToggleChange(cdkDetailRow: CdkDetailRowDirective, row: Element): void {
    if (this.singleChildRowDetail && this.openedRow && this.openedRow.expended) {
      this.openedRow.toggle();
    }
    if (!row.close) {
      // this.cellClicked(row);
      row.close = true;
    } else {
      row.close = false;
    }
    this.openedRow = cdkDetailRow.expended ? cdkDetailRow : undefined;
  }

  chasedetails(id: any,  tiertype: any) {
    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      data => {
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          this.quoteDetails.push(element);
        });
        this.quoteDetails.forEach(element => {
          element["tiertype"] = tiertype;
          console.log("element.tiertype => ", element)
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
          if (element.is_eligible == 'Y') {
            this.eligible = true;
          } else {
            this.eligible = false;
          }
        });
        this.loadingOverlayFlag = false;
      }, error => {
        this.loadingOverlayFlag = false;
      }, () => { }
    )
  }

  optoutDialog() {
    this.dialog.open(OptoutdialogComponent);
  }
  popromiseDialog() {
    this.dialog.open(PopromisedialogComponent);
  }
  optinDialog() {
    this.dialog.open(OptindialogComponent);
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
  goToQuotes(element) {

    window.open(this.apiQuoteUrl + element.quote_id + '/existing');

  }
  goToContracts(element) {
    window.open(this.apiContractUrl + element.expiring_contractnumber + '/contract')
  }
}

export class customer_interaction_required extends DataSource<any> {

  constructor(private orderhistory: orderhistoryComponent, private _paginator: MatPaginator) {
    super();
  }
  disconnect() { }
  connect(): Observable<ChaseDetails[]> {
    const displayDataChanges = [
      this.orderhistory.ChaseDetailsData,
      this._paginator.page
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.orderhistory.data.slice();
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data;
    });
  }
}

export interface Element {
  close?: boolean;
}

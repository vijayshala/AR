import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { AutorenewDashboardComponent } from '../autorenew-dashboard/autorenew-dashboard.component';
import { MatPaginator } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { DataSource } from '@angular/cdk/collections';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { ShareService } from '../../services/share.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
//dialogbox components
import { PopromisedialogComponent } from '../../dialogs/popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { OptindialogComponent } from '../../dialogs/optindialog/optindialog.component';
import { OptOutDashboardComponent } from '../../dialogs/opt-out-dashboard/opt-out-dashboard.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DashposubmitComponent } from 'src/app/dialogs/dashposubmit/dashposubmit.component';
import { ResellersubmitComponent } from 'src/app/dialogs/resellersubmit/resellersubmit.component';
import { ResellerOptoutComponent } from 'src/app/dialogs/reseller-optout/reseller-optout.component';
import { DashchangepayerComponent } from 'src/app/dialogs/dashchangepayer/dashchangepayer.component';
import {ReselleroptindialogComponent} from 'src/app/dialogs/reselleroptindialog/reselleroptindialog.component';
//model from pochase
import { chaseParams } from '../../Model/chaseParams.model';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import { LoaderService } from 'src/app/services/loader.service';
import { HeadingsearchComponent } from '../headingsearch/headingsearch.component';
import * as moment from 'moment';
import { ConditionalExpr } from '@angular/compiler';
//import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { globalDateFormat } from '../../../config/date-format-config';
import { environment } from '../../../environments/environment.dev';
@Component({
  selector: 'app-autorenewdetails',
  templateUrl: './autorenewdetails.component.html',
  styleUrls: ['./autorenewdetails.component.scss', './overridden.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AutorenewdetailsComponent implements OnInit {
  environment_type = environment.environment_type;
  // id: String;
  displayedColumns = ['select', 'autorenew_id', 'email', 't1linkid', 't2linkid','payer', 'End_Customer', 'expandCollapse'];
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  subdisplayedColumns: string[] = ['quote_id', 'expiring_contractnumber', 'contract_expiry_date', 't1linkid', 't2linkid', 'includePromotion', 'quoteSubStatusName', 'total_contract_value', 'End_Customer_Name', 'Quote_status'];
  @Input() singleChildRowDetail: boolean = true;
  private openedRow: CdkDetailRowDirective;
  public dataSource: customer_interaction_required | any;
  public dataSource_search: customer_interaction_required_search | any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() parentCallEvent = new EventEmitter<any>();
  chaseDetails: ChaseDetails;

  expandedElement: customer_interaction_required | null;
  selection = new SelectionModel<ChaseDetails>(true, []);
  quotedataSource: any;
  t1linkId: string;
  t2linkId: string;
  // t1name: string;
  // t2name: string;
  loadingOverlayFlag: boolean = false;
  quoteDetailsObj: any;
  quoteDetails: Array<QuoteDetails>;
  autorenewaldate: any;
  promiseflags: boolean = true;
  result: any;
  maxdate: any;
  ContractNumber: any;
  Freezedateflags: boolean = true;
  autorenewList: any[] = [];
  formatted_date: string;
  quoteslist: any;
  freezedate: string;
  subscription: Subscription;
  startDate: any;
  endDate: any;
  searchTerm: any;
  searchText: any;
  t1linkIdSearchValue: any;
  t2linkIdSearchValue: any;
  PoSubmitFlag: boolean;
  eligible: boolean;
  reseller_flag: string;
  apiQuoteUrl = environment.ApiQuoteEndPint;
  apiContractUrl = environment.ApiContractEndPoint;
  private unsubscribe$ = new Subject();
  constructor(public autorenewdashboard: AutorenewDashboardComponent,
    public searchdatefilter: HeadingsearchComponent, private datePipe: DatePipe,
    public service: AutorenewService, public router: Router,
    private dialog: MatDialog, public loader: LoaderService, public shareService: ShareService,
    private globalDateFormat: globalDateFormat) {
    this.quoteDetails = new Array<QuoteDetails>();
    this.chaseDetails = new ChaseDetails();
  }

  ngOnInit() {
    let pageSize: any = sessionStorage.getItem('pageSize');
    if (pageSize) {
      this.autorenewdashboard.pageSize = pageSize
    }
    this.subscription = this.service.getResellerFlag().subscribe(flag => {
      this.reseller_flag = flag;
    })
    this.subscription = this.service.getPoSubmitVisibleflag().subscribe(PoSubmitVisible => {
      if (PoSubmitVisible == 'Y') {
        this.PoSubmitFlag = true;
      }
      else {
        this.PoSubmitFlag = false;
      }
    })
    this.subscription = this.service.getstartDate().subscribe(startDate => {
      this.startDate = startDate;
    });
    this.subscription = this.service.getendDate().subscribe(enddate => {
      this.endDate = enddate;
    });
    this.subscription = this.service.getsearchText().subscribe(searchText => {
      this.searchText = searchText;
    });
    this.subscription = this.service.getFreezeDate().subscribe(dates => {
      this.freezedate = dates;
    })
    this.subscription = this.service.getAutorenewal().subscribe(
      date => {
        this.autorenewaldate = date;
      }
    )
    // this.getchasedetails(this.id);
    let maxdate: any = moment(new Date(this.chaseDetails.auto_renewal_date)).toDate();
    this.autorenewaldate = moment(maxdate - 1).format('YYYY-MM-DD');
    this.dataSource = new customer_interaction_required(this.autorenewdashboard, this.paginator);
    this.dataSource_search = new customer_interaction_required_search(this.searchdatefilter, this.paginator);

    this.shareService.aClickedEvent.takeUntil(this.unsubscribe$).subscribe((data: string) => {
      this.dashbardOptoutDialog();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete()
  }

  getPaginationResult() {
    let searchText = ""
    let startDate = ""
    let endDate = ""
    let t1linkIdSearchValue = ""
    let t2linkIdSearchValue = ""
    this.autorenewdashboard.pageSize = this.paginator.pageSize;
    sessionStorage.setItem('pageSize', String(this.autorenewdashboard.pageSize));
    this.autorenewdashboard.pageNumber = this.paginator.pageIndex;
    let start_index_autorenew = (this.paginator.pageIndex) * this.paginator.pageSize;
    this.parentCallEvent.next(start_index_autorenew);
    if (this.autorenewdashboard.searchTerm != undefined) {
      searchText = this.autorenewdashboard.searchTerm
    }

    if (this.autorenewdashboard.startDate != null &&
      this.autorenewdashboard.endDate != null &&
      this.autorenewdashboard.startDate != undefined &&
      this.autorenewdashboard.endDate != undefined &&
      this.autorenewdashboard.startDate != '' &&
      this.autorenewdashboard.endDate != '') {
      startDate = this.autorenewdashboard.startDate;
      endDate = this.autorenewdashboard.endDate;
    }

    if (this.autorenewdashboard.t1linkIdSearchValue && this.autorenewdashboard.t1linkIdSearchValue != undefined) t1linkIdSearchValue = this.autorenewdashboard.t1linkIdSearchValue;
    if (this.autorenewdashboard.t2linkIdSearchValue && this.autorenewdashboard.t2linkIdSearchValue != undefined) t2linkIdSearchValue = this.autorenewdashboard.t2linkIdSearchValue;
    this.autorenewdashboard.getCheseData(this.paginator.pageIndex, this.paginator.pageSize, startDate, endDate, searchText, t1linkIdSearchValue, t2linkIdSearchValue)
    // this.searchdatefilter.pageSize = this.paginator.pageSize;
    // this.searchdatefilter.pageNumber = this.paginator.pageIndex;
    // let start_index = (this.paginator.pageIndex) * this.paginator.pageSize;
    // this.parentCallEvent.next(start_index);
    // this.searchdatefilter.getCheseData(this.paginator.pageIndex, this.paginator.pageSize, this.startDate, this.endDate, this.searchText)
  }



  chasedetails(id: any, tiertype: any) {
    console.log("tiertype =>", tiertype)

    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      data => {
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          this.quoteDetails.push(element);
        });
        this.quoteDetails.forEach(element => {
          console.log("element =>", element)
          element["tiertype"] = tiertype;
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


  //Added Button functionalities 

  dashbardOptoutDialog() {
    let dialogRef = this.dialog.open(OptOutDashboardComponent, {
      data: this.autorenewList
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
      this.autorenewList = [];

    });
  }


  optoutDialog(record: any) {
    let dialogRef = this.dialog.open(OptoutdialogComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }

  posubmitDialog(record: any) {
    let dialogRef = this.dialog.open(DashposubmitComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }
  resellerPoSubmitDialog(record: any) {
    let dialogRef = this.dialog.open(ResellersubmitComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }
  resellerOptoutDialog(record: any) {
    let dialogRef = this.dialog.open(ResellerOptoutComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }
  resellerOptinDialog(record: any){
    let dialogRef = this.dialog.open(ReselleroptindialogComponent, {
      data: record

    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }
  changepayerDialog(record: any) {
    let dialogRef = this.dialog.open(DashchangepayerComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }

  popromiseDialog(record: any) {
    let dialogRef = this.dialog.open(PopromisedialogComponent, {
      data: record
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
  }

  optinDialog(record: any) {
    let dialogRef = this.dialog.open(OptindialogComponent, {
      data: record

    });
    dialogRef.afterClosed().subscribe(result => {
      this.getPaginationResult();
    });
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

  onChange(row: any, isChecked: any) {
    if (isChecked == true) {
      this.autorenewList.push(row);
    } else {
      this.autorenewList = this.autorenewList.filter(data => data.autorenew_id !== row.autorenew_id)
    }
    var count = this.autorenewList.length;
    this.autorenewdashboard.checkboxCounts(count);
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
  constructor(private autorenewdashboard: AutorenewDashboardComponent, private _paginator: MatPaginator) {
    super();
  }
  disconnect() { }
  connect(): Observable<ChaseDetails[]> {
    const displayDataChanges = [
      this.autorenewdashboard.ChaseDetailsData,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data = this.autorenewdashboard.data.slice();
      const start_index_autorenew = this._paginator.pageIndex * this._paginator.pageSize;
      return data;
    });
  }
}

export class customer_interaction_required_search extends DataSource<any>{
  constructor(private searchdatefilter: HeadingsearchComponent, private _paginator: MatPaginator) {
    super();
  }
  disconnect() { }
  connect(): Observable<ChaseDetails[]> {
    const displayDataChanges = [
      this.searchdatefilter.ChaseDetailsData,
      this._paginator.page,
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      const data2 = this.searchdatefilter.data.slice();
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data2;
    });
  }
}

export interface Element {
  close?: boolean;
}
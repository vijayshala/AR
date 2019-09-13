import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Chases } from 'src/app/Model/Chases';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { Page } from 'src/app/Model/page';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoaderService } from 'src/app/services/loader.service';
import * as moment from 'moment';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-orderhistory',
  templateUrl: './orderhistory.component.html',
  styleUrls: ['./orderhistory.component.scss']
})
export class orderhistoryComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  startDate: any;
  endDate: any;
  searchTerm: any;
  filterType: string;
  public ChaseDetailsData: BehaviorSubject<ChaseDetails[]> = new BehaviorSubject<ChaseDetails[]>([]);
  chases: Chases;
  chaseDetails: ChaseDetails;
  page: Page;
  chaseList: any;
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  disableDateFilter: boolean = true;
  t1linkIdSearchValue: any;
  t2linkIdSearchValue: any;

  activeDateFilter: boolean = true;
  activeT1LinkFilter: boolean = false;
  activeT2LinkFilter: boolean = false;

  dynamicFilterValue: any = 'Contract End Date';
  tabs = [
    { id: "export", name: "Export", symbol: "fa-upload", active: false },
    { id: "columns", name: "Columns", symbol: "fa-cog", active: true },
    { id: "defaultView", name: "Default View", symbol: "fa-eye", active: true },
    { id: "filter", name: "Filter", symbol: "fa-filter", active: true }
  ];
  selectedTab: any;
  loadingOverlayFlag: boolean = false;
  searchText: any;
  subscription: Subscription;
  result: any;
  activateRoute: string;
  handleId: string;
  public adminRole: any;
  public isProfileActive: boolean = false;
  constructor(public service: AutorenewService, private route: ActivatedRoute, public router: Router, private dialog: MatDialog, public loader: LoaderService) {
    this.chases = new Chases();
    this.page = new Page();
    this.chaseDetails = new ChaseDetails();
    this.pageNumber = 0;
    this.pageSize = 5;
    sessionStorage.setItem('tab', 'orderhistory');
  }

  ngOnInit() {
    this.getAdminRole();
    let srarchText = sessionStorage.getItem("searchTerm");
    if (srarchText != null && srarchText != "" && srarchText.length > 0) {
      this.searchTerm = srarchText;
    }
    var routerObject = sessionStorage.getItem('orderedRouteUrl');
    if (routerObject != null && routerObject != "") {
      var obeject = JSON.parse(routerObject);
      this.getCheseData(obeject.pageNumber, obeject.pageSize, this.startDate, this.endDate, this.searchTerm, obeject.t1linkIdSearchValue, obeject.t2linkIdSearchValue);
      this.pageNumber = obeject.pageNumber;
      this.pageSize = obeject.pageSize;
    }
    else {
      this.getCheseData(this.pageNumber, this.pageSize, this.startDate, this.endDate, this.searchText, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
    }

    if (sessionStorage.getItem("filterStartDate") && sessionStorage.getItem("filterEndDate")) {
      let filterStartDate = sessionStorage.getItem("filterStartDate")
      let filterEndDate = sessionStorage.getItem("filterEndDate")
      this.bsRangeValue = [new Date(filterStartDate), new Date(filterEndDate)]
      this.disableDateFilter = false;
    }
  }

  getAdminRole() {
    this.loadingOverlayFlag = true;
    this.service.adminRole().subscribe(
      userMe => {
        this.adminRole = userMe;
        // this.loadingOverlayFlag = false;
        if (userMe.userTypeId === 2) this.isProfileActive = true;
      },
      error => {
        this.loadingOverlayFlag = false;
      });
  }

  viewProfile() {
    if (this.adminRole.userTypeId && this.adminRole.userTypeId == 2) {
      if (this.adminRole.partnerFunctions && this.adminRole.partnerFunctions.length > 0) {
        var userType = this.adminRole.partnerFunctions[0];
        if (userType == 'DISTI') this.router.navigate(['/distiProfile']);
        else if (userType == 'T1' || userType == 'T2') this.router.navigate(['/resellerProfile/', userType]);
        else this.router.navigate(['/']);
      }
    }
  }

  activatedRoute(route: string) {
    this.activateRoute = route;
  }

  get data(): ChaseDetails[] {
    return this.ChaseDetailsData.value;
  }
  listClick(event: any, newValue: any) {
    this.selectedTab = newValue;
  }
  closeColTab() {
    document.getElementById('filter').className = "tab-pane fade";
  }

  getCheseData(pageNumber: number, pageSize: number, startDate: any, endDate: any, searchText: any, t1linkIdSearchValue: any, t2linkIdSearchValue: any) {
    this.loadingOverlayFlag = true;
    // if (startDate && endDate) {
    //   this.filterType = 'date'
    // } else if (searchText) {
    //   this.filterType = 'text'
    // } else {
    //   this.filterType = 'no';
    // }
    var filterSearchString = "";

    let lastFilterLocation = sessionStorage.getItem('LastSearchFrom');
    if (lastFilterLocation == "filter") {
      if (startDate && startDate != null && endDate && endDate != null) this.filterType = 'date';
      else if (t1linkIdSearchValue && t1linkIdSearchValue != undefined) {
        this.filterType = 't1linkId'
        filterSearchString = t1linkIdSearchValue;
      }
      else if (t2linkIdSearchValue && t2linkIdSearchValue != undefined) {
        this.filterType = 't2linkId'
        filterSearchString = t2linkIdSearchValue;
      }
      else {
        this.filterType = 'no';
      }
    }
    if (lastFilterLocation == "search") {
      if (searchText && searchText != undefined) {
        this.filterType = 'text'
        filterSearchString = searchText;
      }
      else {
        this.filterType = 'no';
      }
    }

    let searchEntity = new Object();
    if (this.filterType == 'date') {
      searchEntity = {
        status: 'ordered',
        filterType: 'date',
        startDate: startDate,
        endDate: endDate
      }
    }
    else {
      searchEntity = {
        status: 'ordered',
        filterType: this.filterType,
        searchString: filterSearchString,
      }
    }

    sessionStorage.setItem('t1linkIdSearchValue', this.t1linkIdSearchValue);
    sessionStorage.setItem('t2linkIdSearchValue', this.t2linkIdSearchValue);
    // this.service.getCheseData(pageNumber + 1, pageSize, "ordered", this.filterType, searchText, startDate, endDate,this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue).subscribe(
    this.service.getOrderedChaseData(pageNumber + 1, pageSize, searchEntity).subscribe(
      data => {
        this.chases = data;
        this.page = data.page;
        this.handleId = this.chases.handleId;
        this.chaseList = this.chases.chaseList;
        this.ChaseDetailsData.next(this.chases.chaseList);
        this.chaseList.forEach(element => {
        element.t1name= String(element.t1name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');   
        element.t2name= String(element.t2name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');  
        element.payer_name= String(element.payer_name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
        element.new_payer_name= String(element.new_payer_name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'); 
                       })
        this.setRoutePositions(pageNumber, pageSize, "ordered", this.filterType, searchText, startDate, endDate,this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
      },
      error => { },
      () => {
        this.loadingOverlayFlag = false;
      }
    )
  }
  genrateFilter() {
    if (this.dynamicFilterValue === 'Contract End Date') {
      this.activeDateFilter = true;
      this.activeT1LinkFilter = false;
      this.activeT2LinkFilter = false;
      this.t1linkIdSearchValue = null;
      this.t2linkIdSearchValue = null;

    } else if (this.dynamicFilterValue === 'Tier1 Link Id') {
      this.activeDateFilter = false;
      this.activeT1LinkFilter = true;
      this.activeT2LinkFilter = false;
      this.bsRangeValue = null;
      this.startDate = null;
      this.endDate = null;
      this.t2linkIdSearchValue = null;

    } else if (this.dynamicFilterValue === 'Tier2 Link Id') {
      this.activeDateFilter = false;
      this.activeT1LinkFilter = false;
      this.activeT2LinkFilter = true;
      this.t1linkIdSearchValue = null;
      this.bsRangeValue = null;
      this.startDate = null;
      this.endDate = null;
    }
  }
  filter(searchCriteria) {
    let searchEntity = new Object();
    if (this.bsRangeValue != null) {
      let s_date: any = this.bsRangeValue.splice(0, 1);
      this.startDate = moment(new Date(s_date)).format('DD-MM-YYYY');
      let e_date: any = this.bsRangeValue.splice(0, 1);
      this.endDate = moment(new Date(e_date)).format('DD-MM-YYYY');
      this.loadingOverlayFlag = true;
      sessionStorage.setItem('startDate', this.startDate)
      sessionStorage.setItem('endDate', this.endDate)
      sessionStorage.setItem('filterStartDate', s_date)
      sessionStorage.setItem('filterEndDate', e_date)
    }
    this.service.filters(this.startDate, this.endDate, this.searchTerm)
    this.pageNumber = 0;
    if (searchCriteria == 'dateRangeSearch') {
      searchEntity = {
        status: 'ordered',
        filterType: 'date',
        searchString: this.searchTerm,
        startDate: this.startDate,
        endDate: this.endDate
      }
    } else if (searchCriteria == 't1LinkSearch') {
      searchEntity = {
        status: 'ordered',
        filterType: "t1linkId",
        searchString: this.t1linkIdSearchValue,
      }

    } else if (searchCriteria == 't2LinkSearch') {
      searchEntity = {
        status: 'ordered',
        filterType: "t2linkId",
        searchString: this.t2linkIdSearchValue,
      }
    }
    sessionStorage.setItem('t1linkIdSearchValue', this.t1linkIdSearchValue);
    sessionStorage.setItem('t2linkIdSearchValue', this.t2linkIdSearchValue);
    //  this.service.getCheseData(this.pageNumber + 1, this.pageSize, "ordered", 'date', this.searchTerm, this.startDate, this.endDate).subscribe(
    this.service.getOrderedChaseData(this.pageNumber + 1, this.pageSize, searchEntity).subscribe(
      data => {
        this.chases = data;
        this.page = data.page;
        this.chaseList = this.chases.chaseList;
        this.ChaseDetailsData.next(this.chases.chaseList);
        this.setRoutePositions(this.pageNumber, this.pageSize, "ordered", 'date', this.searchTerm, this.startDate, this.endDate, this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
      },
      error => { this.loadingOverlayFlag = false; },
      () => {
        this.loadingOverlayFlag = false;
      }
    );
    sessionStorage.setItem('LastSearchFrom', "filter");
  }

  searchtext() {
    this.bsRangeValue = []; // for clear date filer input
    this.disableDateFilter = true; // for dsiable date filter button

    let trimedSearchTerm = ""
    if (this.searchTerm != null) trimedSearchTerm = this.searchTerm.trim()
    if (trimedSearchTerm != null && trimedSearchTerm != "" && trimedSearchTerm.length > 0) {
      this.loadingOverlayFlag = true;
      this.service.filters(this.startDate, this.endDate, trimedSearchTerm)
      sessionStorage.setItem('searchTerm', trimedSearchTerm);
      this.pageNumber = 0;
      this.service.getCheseData(this.pageNumber + 1, this.pageSize, "ordered", 'text', trimedSearchTerm, this.startDate, this.endDate).subscribe(
        data => {
          this.chases = data;
          this.page = data.page;
          this.chaseList = this.chases.chaseList;
          this.totalRecords = this.chases['page']["totalRecords"];
          this.ChaseDetailsData.next(this.chases.chaseList);
          this.setRoutePositions(this.pageNumber, this.pageSize, "ordered", 'text', trimedSearchTerm, this.startDate, this.endDate, this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
        },
        error => { this.loadingOverlayFlag = false; },
        () => {
          this.loadingOverlayFlag = false;
        }
      );
    } else {
      this.getCheseData(this.pageNumber, this.pageSize, this.startDate, this.endDate, this.searchText, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
      sessionStorage.removeItem('searchTerm');
    }
  }
  Reset() {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.t1linkIdSearchValue = '';
    this.t2linkIdSearchValue = '';
    this.dynamicFilterValue = 'Contract End Date';
    this.activeDateFilter = true;
    this.activeT1LinkFilter = false;
    this.activeT2LinkFilter = false;
    sessionStorage.removeItem('searchTerm');
    sessionStorage.removeItem('orderedRouteUrl');
    sessionStorage.removeItem('filterStartDate');
    sessionStorage.removeItem('filterEndDate');
    this.pageNumber = 0;
    this.getCheseData(this.pageNumber, this.pageSize, this.startDate, this.endDate, this.searchText, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
    this.searchtext();
  }

  exportAllData() {
    this.loadingOverlayFlag = true;
    if (this.startDate && this.endDate) {
      this.service.exportAllDataService('ordered', 'date', '', this.startDate, this.endDate, '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Ordered' + ' ' + this.handleId + '.xlsx');

      })
    }
    else if (this.searchTerm) {
      this.service.exportAllDataService('ordered', 'text', this.searchTerm, this.startDate, this.endDate, '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Ordered' + ' ' + this.handleId + '.xlsx');
      })
    }
    else if (this.t1linkIdSearchValue) {
      this.service.exportAllDataService('ordered', 't1linkId', this.t1linkIdSearchValue, '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Ordered' + ' ' + this.handleId + '.xlsx');
      })
    }
    else if (this.t2linkIdSearchValue) {
      this.service.exportAllDataService('ordered', 't2linkId', this.t2linkIdSearchValue, '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Ordered' + ' ' + this.handleId + '.xlsx');
      })
    } else {
      this.service.exportAllDataService('ordered', 'no', '', '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Ordered' + ' ' + this.handleId + '.xlsx');
      })
    }

  }

  dateValidation(daterange) {
    if (daterange !== undefined && daterange !== null && daterange[0] !== null) {
      this.disableDateFilter = false;
    }
    else this.disableDateFilter = true;
    // sessionStorage.removeItem('filterStartDate');
    // sessionStorage.removeItem('filterEndDate');
  }

  setRoutePositions(pageNumber: number, pageSize: number, status: any, filterType: string, searchString: string, startDate: string, endDate: string, dynamicFilterValue: string, t1linkIdSearchValue: string, t2linkIdSearchValue: string) {
    var routeObject = { "pageNumber": pageNumber, "pageSize": pageSize, "status": status, "filterType": filterType, "searchString": searchString, "startDate": startDate, "endDate": endDate, "dynamicFilterValue": dynamicFilterValue, "t1linkIdSearchValue": t1linkIdSearchValue, "t2linkIdSearchValue": t2linkIdSearchValue }
    sessionStorage.setItem('orderedRouteUrl', JSON.stringify(routeObject));
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}

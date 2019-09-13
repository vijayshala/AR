import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Chases } from 'src/app/Model/Chases';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { Page } from 'src/app/Model/page';
import { LoaderService } from 'src/app/services/loader.service';
import { Subscription } from 'rxjs';
//Header Search
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PopromisedialogComponent } from '../../dialogs/popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { OptindialogComponent } from '../../dialogs/optindialog/optindialog.component';
import * as moment from 'moment';
import * as saveAs from 'file-saver';
import { Alert } from 'selenium-webdriver';
import { ShareService } from '../../services/share.service';

@Component({
  selector: "app-autorenew-dashboard",
  templateUrl: "./autorenew-dashboard.component.html",
  styleUrls: ["./autorenew-dashboard.component.scss"]
})
export class AutorenewDashboardComponent implements OnInit {
  //Header Component
  is_RESELLER: string;
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  startDate: any;
  handleId: string;
  endDate: any;
  searchTerm: any;
  filterType: string;
  loadingOverlayFlag: boolean = false;

  public ChaseDetailsData: BehaviorSubject<ChaseDetails[]> = new BehaviorSubject<ChaseDetails[]>([]);
  chases: Chases;
  chaseDetails: ChaseDetails;
  page: Page;
  public chaseList: any = [];
  pageNumber: number;
  totalRecords: number;
  pageSize: number;
  PoSubmitVisible: string;
  subscription: Subscription;
  checkboxCount: boolean = true;
  t1linkIdSearchValue: any;
  t2linkIdSearchValue: any;

  activeDateFilter: boolean = true;
  activeT1LinkFilter: boolean = false;
  activeT2LinkFilter: boolean = false;

  dynamicFilterValue: any = 'Contract End Date';
  // loadingOverlayFlag: boolean = false;
  // public ChaseDetailsData: BehaviorSubject<ChaseDetails[]> = new BehaviorSubject<ChaseDetails[]>([]);
  // chases: Chases;
  // chaseDetails: ChaseDetails;
  // page: Page;
  // chaseList: any;
  // pageNumber: number;
  // pageSize: number;
  tabs = [
    { id: "export", name: "Export", symbol: "fa-upload", active: false },
    { id: "columns", name: "Columns", symbol: "fa-cog", active: true },
    { id: "defaultView", name: "Default View", symbol: "fa-eye", active: true },
    { id: "filter", name: "Filter", symbol: "fa-filter", active: true }
  ];
  selectedTab: any;
  // startDate: any;
  // endDate: any;
  searchText: any;
  result: any;
  freezedate: string;
  // filterType: string;

  promiseflags: boolean = true;
  promiseDateflag: boolean = true;
  Freezedateflags: boolean = true;
  autorenewList: any[] = [];
  partnerFunctionArray:any[]=[];
  formatted_date: string;
  formatted_Date: string;
  disableDateFilter: boolean = true;
   activateRoute: string;
  public adminRole: any;
  public isProfileActive: boolean = false;
  constructor(private dialog: MatDialog, private datePipe: DatePipe,
    public service: AutorenewService,
    public router: Router,
    public loader: LoaderService,
    public sharedService: ShareService,
    private route: ActivatedRoute
  ) {
    this.chases = new Chases();
    this.page = new Page();
    this.chaseDetails = new ChaseDetails();
    this.pageNumber = 0;
    this.pageSize = 5;

    this.maxDate.setDate(this.maxDate.getDate() + 7);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
    sessionStorage.setItem('tab', 'autorenewdashboard');

  }

  ngOnInit() {
    this.getAdminRole(); //To Get user Admin Role DISTI OR Reseller

    let srarchText = sessionStorage.getItem("searchTerm");
    if (srarchText != null && srarchText != "" && srarchText.length > 0) {
      this.searchTerm = srarchText;
    }

    var routerObject = sessionStorage.getItem('pendingRouteUrl');
    if (routerObject != null && routerObject != "") {
      var obeject = JSON.parse(routerObject);
      this.getCheseData(obeject.pageNumber, obeject.pageSize, obeject.startDate, obeject.endDate, this.searchTerm, obeject.t1linkIdSearchValue, obeject.t2linkIdSearchValue);
      this.pageNumber = obeject.pageNumber;
      this.pageSize = obeject.pageSize;
      this.dynamicFilterValue = obeject.dynamicFilterValue;
      this.genrateFilter();
      this.t1linkIdSearchValue = obeject.t1linkIdSearchValue;
      this.t2linkIdSearchValue = obeject.t2linkIdSearchValue;
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
        var i;
        for(i=0;i<this.adminRole.partnerFunctions.length;i++){
          this.partnerFunctionArray.push(this.adminRole.partnerFunctions[i])
          userType= this.partnerFunctionArray.join('&');
          console.log("userTypes::"+userType)
        
        if (userType == 'DISTI') this.router.navigate(['/distiProfile']);
        else if (userType == 'T1' || userType == 'T2') this.router.navigate(['/resellerProfile/', userType]);
        else if(userType == 'T2&T1') this.router.navigate(['/t1-t2-profile/', userType]);
        else this.router.navigate(['/']);
      }}
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
    document.getElementById("filter").className = "tab-pane fade";
  }

  checkboxCounts(count) {
    if (count > 0) this.checkboxCount = false;
    else this.checkboxCount = true;
  }

  getCheseData(pageNumber: number, pageSize: number, startDate: any, endDate: any, searchText: any, t1linkIdSearchValue: any, t2linkIdSearchValue: any) {

    this.loadingOverlayFlag = true;
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
        status: 'pending',
        filterType: 'date',
        startDate: startDate,
        endDate: endDate
      }
    }
    else {
      searchEntity = {
        status: 'pending',
        filterType: this.filterType,
        searchString: filterSearchString,
      }
    }

    sessionStorage.setItem('t1linkIdSearchValue', this.t1linkIdSearchValue);
    sessionStorage.setItem('t2linkIdSearchValue', this.t2linkIdSearchValue);
    this.service.getPendingChaseData(pageNumber + 1, pageSize, searchEntity).subscribe(

      // this.service.getCheseData(pageNumber + 1, pageSize, "pending", this.filterType, searchText, startDate, endDate).subscribe(
      data => {
        this.chases = data;
        this.handleId = this.chases.handleId;
        this.service.reseller_flag(this.chases.is_RESELLER);
        this.is_RESELLER = data.is_RESELLER;
        this.page = data.page;
        this.PoSubmitVisible = this.chases.po_SUBMIT_VISIBLE;
        this.service.PoSubmitVisibleflag(this.PoSubmitVisible);
        this.chaseList = this.chases.chaseList;

        this.ChaseDetailsData.next(this.chases.chaseList);
        this.chaseList.forEach(element => {
element.t1name= String(element.t1name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');   
          element.t2name= String(element.t2name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');   
          element.payer_name= String(element.payer_name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
          element.new_payer_name= String(element.new_payer_name).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');     
        this.service.TierType(element.tiertype);
         let auto = new Date(element.auto_renewal_date);

          let autorenewal_date = auto.setDate(auto.getDate() - 1);
          let current_date = new Date().setDate(new Date().getDate());

          let autorewnewal = moment.unix(autorenewal_date).format("YYYY-MM-DD");
          let freeze: any = moment(new Date(element.freeze_auto_renewal_date)).toDate();
          let freezedate = moment(freeze).format('YYYY-MM-DD');

          this.service.getDatesAuto_freeze(autorewnewal, freezedate);
          let current_datetime = new Date()
          this.formatted_Date = this.datePipe.transform(current_datetime, 'yyyy-MM-dd');
          // let popromise_date = this.datePipe.transform(element.promise_date, 'yyyy-MM-dd')

          //  this.formatted_date = moment(current_datetime).format('MM/DD/YYYY');
          // this.freezedate = moment(element.freeze_auto_renewal_date).format('MM/DD/YYYY');
          // let popromise_date = moment(element.promise_date).format('MM/DD/YYYY');

          if (element.promise_date < this.formatted_date) {
            element.promiseDateflag = true;
            console.log("element.promiseDateflag" + element.promiseDateflag)
          }
          else {
            element.promiseDateflag = false;
            console.log("element.promiseDateflag" + element.promiseDateflag)
          }

          if (element.freeze_auto_renewal_date >= this.formatted_Date) {
            element.Freezedateflags = false;
          }
          else {
            element.Freezedateflags = true;

          }

          if (element.auto_renewal_date >= this.formatted_Date) {
            element.promiseflags = false;
          }
          else {
            element.promiseflags = true;
          }
        });
        this.setRoutePositions(pageNumber, pageSize, "pending", this.filterType, searchText, startDate, endDate, this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
        let userTypes = {"is_RESELLER": data["is_RESELLER"], "is_DISTRIBUTOR": data["is_DISTRIBUTOR"]}
        sessionStorage.setItem('userType', JSON.stringify(userTypes));
      },
      error => { },
      () => {
        this.loadingOverlayFlag = false;
      }
    );
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
      sessionStorage.setItem('filterStartDate', s_date)
      sessionStorage.setItem('filterEndDate', e_date)
    }
    this.loadingOverlayFlag = true;
    sessionStorage.setItem('startDate', this.startDate)
    sessionStorage.setItem('endDate', this.endDate)
    this.loadingOverlayFlag = true;
    // sessionStorage.setItem('bsRangeValue', this.bsRangeValue.toLocaleString())
    this.service.filters(this.startDate, this.endDate, this.searchTerm)
    // this.service._filters(this.startDate, this.endDate,this.t1linkIdSearchValue || this.t2linkIdSearchValue )
    this.pageNumber = 0;
    if (searchCriteria == 'dateRangeSearch') {
      searchEntity = {
        status: 'pending',
        filterType: 'date',
        searchString: this.searchTerm,
        startDate: this.startDate,
        endDate: this.endDate
      }
    } else if (searchCriteria == 't1LinkSearch') {
      searchEntity = {
        status: 'pending',
        filterType: "t1linkId",
        searchString: this.t1linkIdSearchValue,
      }

    } else if (searchCriteria == 't2LinkSearch') {
      searchEntity = {
        status: 'pending',
        filterType: "t2linkId",
        searchString: this.t2linkIdSearchValue,
      }
    }
    sessionStorage.setItem('t1linkIdSearchValue', this.t1linkIdSearchValue);
    sessionStorage.setItem('t2linkIdSearchValue', this.t2linkIdSearchValue);
    // this.service.getCheseData(this.pageNumber + 1, this.pageSize, "pending", 'date', this.searchTerm, this.startDate, this.endDate).subscribe(
    this.service.getPendingChaseData(this.pageNumber + 1, this.pageSize, searchEntity).subscribe(
      data => {
        this.chases = data;
        this.page = data.page;
        this.chaseList = this.chases.chaseList;
        this.ChaseDetailsData.next(this.chases.chaseList);
        this.chaseList.forEach(element => {
          let maxdate: Date = moment(element.auto_renewal_date).toDate();
          let autorewnewal: any = moment(maxdate.getDate() - 1).format('YYYY-MM-DD');
          let freeze: any = moment(new Date(element.freeze_auto_renewal_date)).toDate();
          let freezedate = moment(freeze).format('YYYY-MM-DD');
          this.service.getDatesAuto_freeze(autorewnewal, freezedate);

          let current_datetime = new Date()
          this.formatted_Date = this.datePipe.transform(current_datetime, 'yyyy-MM-dd');
          // let popromise_date = this.datePipe.transform(element.promise_date, 'yyyy-MM-dd')

          this.formatted_date = moment(current_datetime).format('MM/DD/YYYY');
          // this.freezedate = moment(element.freeze_auto_renewal_date).format('MM/DD/YYYY');
          let popromise_date = moment(element.promise_date).format('MM/DD/YYYY');

          if (popromise_date < this.formatted_date) {
            element.promiseDateflag = true;
          }
          else {
            element.promiseDateflag = false;
          }
          if (element.auto_renewal_date >= this.formatted_Date) {
            element.Freezedateflags = false;
          }
          else {
            element.Freezedateflags = true;

          }
          if (element.auto_renewal_date > this.formatted_Date) {
            element.promiseflags = false;

          }
          else {
            element.promiseflags = true;

          }
        });
        this.setRoutePositions(this.pageNumber, this.pageSize, "pending", 'date', this.searchTerm, this.startDate, this.endDate, this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
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
      sessionStorage.setItem('searchTerm', trimedSearchTerm);
      this.loadingOverlayFlag = true;
      this.service.filters(this.startDate, this.endDate, trimedSearchTerm)
      this.pageNumber = 0;

      let searchEntity = new Object();
      searchEntity = {
        status: 'pending',
        filterType: 'text',
        searchString: trimedSearchTerm
      }
      this.service.getPendingChaseData(this.pageNumber + 1, this.pageSize, searchEntity).subscribe(
        // this.service.getCheseData(this.pageNumber + 1, this.pageSize, "pending", 'text', trimedSearchTerm, this.startDate, this.endDate).subscribe(
        data => {
          this.chases = data;
          this.page = data.page;
          this.chaseList = this.chases.chaseList;
          this.totalRecords = this.chases['page']["totalRecords"];

          this.ChaseDetailsData.next(this.chases.chaseList);
          this.dateFormater(this.chaseList);
          this.setRoutePositions(this.pageNumber, this.pageSize, "pending", 'text', trimedSearchTerm, this.startDate, this.endDate, this.dynamicFilterValue, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
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
    sessionStorage.setItem('LastSearchFrom', "search");
  }

  dateFormater(chaseList) {
    chaseList.forEach(element => {
      let maxdate: any = moment(new Date(element.auto_renewal_date)).toDate();
      let autorewnewal = moment(maxdate - 1).format('YYYY-MM-DD');

      let freeze: any = moment(new Date(element.freeze_auto_renewal_date)).toDate();
      let freezedate = moment(freeze).format('YYYY-MM-DD');
      this.service.getDatesAuto_freeze(autorewnewal, freezedate);

      let current_datetime = new Date()
      this.formatted_Date = this.datePipe.transform(current_datetime, 'yyyy-MM-dd');
      // this.freezedate = this.datePipe.transform(element.freeze_auto_renewal_date, 'yyyy-MM-dd')
      // let popromise_date = this.datePipe.transform(element.promise_date, 'yyyy-MM-dd')
      this.formatted_date = moment(current_datetime).format('MM/DD/YYYY');
      this.freezedate = moment(element.freeze_auto_renewal_date).format('MM/DD/YYYY');
      let popromise_date = moment(element.promise_date).format('MM/DD/YYYY');

      if (popromise_date < this.formatted_date) {
        element.promiseDateflag = true;
      }
      else {
        element.promiseDateflag = false;
      }
      if (element.freeze_auto_renewal_date > this.formatted_Date) {
        element.Freezedateflags = false;
      }
      else {
        element.Freezedateflags = true;

      }
      if (element.auto_renewal_date >= this.formatted_Date) {
        element.promiseflags = false;


      }
      else {
        element.promiseflags = true;

      }
    });
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
    sessionStorage.removeItem('pendingRouteUrl');
    sessionStorage.removeItem('filterStartDate');
    sessionStorage.removeItem('filterEndDate');
    this.pageNumber = 0;
    // this.pageSize = 5;
    this.getCheseData(this.pageNumber, this.pageSize, this.startDate, this.endDate, this.searchText, this.t1linkIdSearchValue, this.t2linkIdSearchValue);
  }
  masteroptoutDialog() {
    this.sharedService.AClicked("openDialog");
  }

  exportAllData() {
    this.loadingOverlayFlag = true;
    if (this.startDate && this.endDate) {
      this.service.exportAllDataService('pending', 'date', '', this.startDate, this.endDate, '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Pending' + ' ' + this.handleId + '.xlsx');
        sessionStorage.removeItem('filterStartDate');
        sessionStorage.removeItem('filterEndDate');
      })
    }
    else if (this.searchTerm) {
      this.service.exportAllDataService('pending', 'text', this.searchTerm, this.startDate, this.endDate, '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Pending' + ' ' + this.handleId + '.xlsx');
        sessionStorage.removeItem('searchTerm');
      })
    }
    else if (this.t1linkIdSearchValue) {
      this.service.exportAllDataService('pending', 't1linkId', this.t1linkIdSearchValue, '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Pending' + ' ' + this.handleId + '.xlsx');
      })
    }
    else if (this.t2linkIdSearchValue) {
      this.service.exportAllDataService('pending', 't2linkId', this.t2linkIdSearchValue, '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Pending' + ' ' + this.handleId + '.xlsx');
      })
    }
    else {
      this.service.exportAllDataService('pending', 'no', '', '', '', '', '').subscribe(Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
        let Result = new Blob([this.result],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(Result, 'Auto-Renewal Dashboard Pending' + ' ' + this.handleId + '.xlsx');
      })
    }
  }

  dateValidation(daterange) {
    if (daterange !== undefined && daterange !== null && daterange[0] !== null) {
      this.disableDateFilter = false;
    }
    else this.disableDateFilter = true;
    sessionStorage.removeItem('filterStartDate');
    sessionStorage.removeItem('filterEndDate');
  }

  setRoutePositions(pageNumber: number, pageSize: number, status: any, filterType: string, searchString: string, startDate: string, endDate: string, dynamicFilterValue: string, t1linkIdSearchValue: string, t2linkIdSearchValue: string) {
    var routeObject = { "pageNumber": pageNumber, "pageSize": pageSize, "status": status, "filterType": filterType, "searchString": searchString, "startDate": startDate, "endDate": endDate, "dynamicFilterValue": dynamicFilterValue, "t1linkIdSearchValue": t1linkIdSearchValue, "t2linkIdSearchValue": t2linkIdSearchValue }
    sessionStorage.setItem('pendingRouteUrl', JSON.stringify(routeObject));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PopromisedialogComponent } from '../../dialogs/popromisedialog/popromisedialog.component';
import { OptoutdialogComponent } from '../../dialogs/optoutdialog/optoutdialog.component';
import { OptindialogComponent } from '../../dialogs/optindialog/optindialog.component';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { ShareService } from '../../services/share.service';
import * as moment from 'moment';
import { Chases } from 'src/app/Model/Chases';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { Page } from 'src/app/Model/page';
import { Observable, BehaviorSubject } from 'rxjs';
import { Alert } from 'selenium-webdriver';

@Component({
  selector: 'app-headingsearch',
  templateUrl: './headingsearch.component.html',
  styleUrls: ['./headingsearch.component.scss']
})
export class HeadingsearchComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  startDate: any;
  endDate: any;
  searchTerm: any;
  filterType: string;
  loadingOverlayFlag: boolean = false;

  public ChaseDetailsData: BehaviorSubject<ChaseDetails[]> = new BehaviorSubject<ChaseDetails[]>([]);
  chases: Chases;
  chaseDetails: ChaseDetails;
  page: Page;
  chaseList: any;
  pageNumber: number;
  pageSize: number;

  constructor(private dialog: MatDialog, public service: AutorenewService, public sharedService: ShareService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    // this.bsRangeValue = [this.bsValue, this.maxDate];
    this.chases = new Chases();
    this.page = new Page();
    this.chaseDetails = new ChaseDetails();
    this.pageNumber = 0;
    this.pageSize = 5;
  }

  ngOnInit() { }

  get data(): ChaseDetails[] {
    return this.ChaseDetailsData.value;
  }
  getCheseData(pageNumber: number, pageSize: number,startDate:any,endDate:any,searchText:any) {
    this.loadingOverlayFlag = true;
    if (startDate && endDate) {
      this.filterType = 'date'
    } else if (searchText) {
      this.filterType = 'text'
    } else {
      this.filterType = 'no';
    }
    this.service.getCheseData(pageNumber + 1, pageSize, "pending", this.filterType, searchText,startDate,endDate).subscribe(
      data => {
        this.chases = data;
        this.page = data.page;
        this.chaseList = this.chases.chaseList;
        this.ChaseDetailsData.next(this.chases.chaseList);
      },
      error => { },
      () => {
        this.loadingOverlayFlag = false;
      }
    );
  }

  filter() {
    let s_date: any = this.bsRangeValue.splice(0, 1);
    this.startDate = moment(new Date(s_date)).format('DD-MM-YYYY');
    let e_date: any = this.bsRangeValue.splice(0, 1);
    this.endDate = moment(new Date(e_date)).format('DD-MM-YYYY');
    this.loadingOverlayFlag = true;
    this.service.getCheseData(this.pageNumber + 1, this.pageSize, "pending", 'date', this.searchTerm, this.startDate, this.endDate).subscribe(
      data => {
        this.chases = data;
        this.page = data.page;
        this.chaseList = this.chases.chaseList;
        this.ChaseDetailsData.next(this.chases.chaseList);
      },
      error => { this.loadingOverlayFlag = false; },
      () => {
        this.loadingOverlayFlag = false;
      }
    );
  }

  searchText() {
    this.loadingOverlayFlag = true;
    this.service.getCheseData(this.pageNumber + 1, this.pageSize, "pending", 'text', this.searchTerm, this.startDate, this.endDate).subscribe(
      data => {
        this.chases = data;
        let result = JSON.stringify(data);
        this.page = data.page;
        this.chaseList = this.chases.chaseList;
        let totalCount = this.chases['page']["totalRecords"];
        this.ChaseDetailsData.next(this.chases.chaseList);
      },
      error => { this.loadingOverlayFlag = false; },
      () => {
        this.loadingOverlayFlag = false;
      }
    );
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
  masteroptoutDialog() {
    // this.dialog.open(MasteroptoutdialogComponent);
    // this.sharedService.AClicked("openDialog");
  }
}

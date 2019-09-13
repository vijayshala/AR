import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EmptyError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})

export class ProfileDetailsComponent implements OnInit {
  public loadingOverlayFlag: boolean = false;
  public profileData: any;
  public _profileData: any;
  public poSuffix = 'None';
  public selectedPrefixName = 'K0';
  public selectedSuffixName = 'K0';
  public _poNumber = [];
  selected = 'Yes';
  public linkIdList: any[] = [];

  resellerDataSource: MatTableDataSource<any>;
  distributorDataSource: MatTableDataSource<any>;

  @ViewChild("paginator1") paginator1: MatPaginator;
  @ViewChild("paginator2") paginator2: MatPaginator;

  columnsHeader: string[] = [
    "Link_Id",
    "Email_Id",
    "Po_Number",
    "intrested_to_auto_renew"
  ];

  resellerColumnsHeader: string[] = ["Link_Id", "Reseller_name", "Email_Id", "Set_Reminders"];

  prefixList = [
    { key: 'K0', value: 'None' },
    { key: 'K1', value: 'User entered alphanumeric value' },
    { key: 'K2', value: 'Reseller LinkID' },
    { key: 'K3', value: 'Prior Contract’s PO Number' }
  ];

  intrestedAutoRenewList = [
    { key: 'Y', value: 'Yes' },
    { key: 'N', value: 'No' }
  ];
  validateSubmitButton: boolean = false;
  constructor(public service: AutorenewService, public loader: LoaderService, public router: Router) {
  }

  ngOnInit() {
    this.loadingOverlayFlag = true;
    this.getProfileData();
  }

  getProfileData() {
    this.service.getProfileDistData().subscribe(profileData => {
      this.loadingOverlayFlag = false;
      this.profileData = profileData;
      this._profileData = JSON.parse(JSON.stringify(profileData));

      this.distributorDataSource = new MatTableDataSource(this.profileData.userDistributor.distributorList);
      this.resellerDataSource = new MatTableDataSource(this.profileData.resellerList);
      this.linkIdList = this.profileData.resellerList;
      this.distributorDataSource.paginator = this.paginator1;
      this.resellerDataSource.paginator = this.paginator2;
    }, (err) => {
      this.loadingOverlayFlag = false;
    });
  }

  // ngAfterViewInit() {
  //   this.distributorDataSource = new MatTableDataSource(this.profileData.userDistributor.distributorList);
  //   this.resellerDataSource = new MatTableDataSource(this.profileData.resellerList);
  //   this.distributorDataSource.paginator = this.paginator1;
  //   this.resellerDataSource.paginator = this.paginator2;
  // }

  formPoNumber() {
    let newString = new String
    Object.values(this._poNumber).forEach((obj) => newString += obj)
    return newString.length ? newString : null
  }

  submitProfile() {
    this.loadingOverlayFlag = true;
    this.cleanProfileData();
    this.service.submitProfileDistData(this.profileData).subscribe((response: any) => {
      if (response == "SUCCESS") {
        this.loadingOverlayFlag = false;
        this.getProfileData();
        // this.ngAfterViewInit()
      }
    },
      (err) => {
        this.loadingOverlayFlag = false;
      });
  }

  cancelChanges() {
    this.profileData = JSON.parse(JSON.stringify(this._profileData));
    // this.ngAfterViewInit()
  }

  cleanProfileData() {
    this.profileData.userDistributor.distributorList.forEach(element => {
      if (element.hasOwnProperty('emailNewValue')) { element['distiEmailId'] = element['emailNewValue'] }
      delete element['updatePO']
      delete element['updateEmail']
      delete element['emailNewValue']
    });
    this.profileData.resellerList.forEach(element => {
      if (element.hasOwnProperty('newResEmailId')) { element['resEmailId'] = element['newResEmailId'] }
      delete element['newResEmailId']
      delete element['updateMail']
    });
  }

  gotoDashboard() {
    let pathurl = sessionStorage.getItem('tab');
    if (pathurl) {
      this.router.navigate(['/' + pathurl]);
    } else {
      this.router.navigate(['/autorenewdashboard']);
    }
  }

  checkEmails(valid: any) {
    if(valid == true) this.validateSubmitButton = true
    else this.validateSubmitButton = false;
  }
}

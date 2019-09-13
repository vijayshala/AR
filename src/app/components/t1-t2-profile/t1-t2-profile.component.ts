import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, EmptyError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-t1-t2-profile',
  templateUrl: './t1-t2-profile.component.html',
  styleUrls: ['./t1-t2-profile.component.scss']
})
export class T1T2ProfileComponent implements OnInit {
  public loadingOverlayFlag: boolean = false;
  public adminRole: string = "";
  public profileData: any;
  public profileData1: any;
  public _profileData: any;
  public poSuffix = 'None';
  public selectedPrefixName = 'K0';
  public selectedSuffixName = 'K0';
  public _poNumber = [];
  public isT1ResellerList:boolean;
  public isT2ResellerList:boolean;
  t2ResellerDataSource: MatTableDataSource<any>;
  t1ResellerDataSource: MatTableDataSource<any>;

  @ViewChild("paginator1") paginator1: MatPaginator;
  @ViewChild("paginator2") paginator2: MatPaginator;

  columnsHeader: string[] = [
    "Link_Id",
    "Email_Id",
    "Po_Number",
    "interested_to_auto_renew"
  ];

  resellerColumnsHeader: string[] = ["Link_Id", "Reseller_name", "Email_Id"];

  prefixList = [
    { key: 'K0', value: 'None' },
    { key: 'K1', value: 'User entered alphanumeric value' },
    { key: 'K2', value: 'Reseller LinkID' },
    { key: 'K3', value: 'Prior Contract’s PO Number' }
  ];

  interestedAutoRenewList = [
    { key: 'Y', value: 'Yes' },
    { key: 'N', value: 'No' }
  ];
  linkIdList:any[]=[];
  // linkIdList = [
  //   { key: '1', value: '1' },
  //   { key: '2', value: '2' },
  //   { key: '3', value: '3' },
  //   { key: '4', value: '4' },
  // ];

  constructor(public service: AutorenewService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.adminRole = params['id'];
    });

    this.loadingOverlayFlag = true;
    this.getProfileDataT1();
    this.getProfileDataT2();
  }
  getProfileDataT1() {
    // if (this.adminRole == 'T1') {
    //   console.log("inside T1 User ==>", this.adminRole);
      this.service.getResellerT1ProfileData().subscribe(profileData => {
        this.loadingOverlayFlag = false;
        this.profileData1 = profileData;
        if(this.profileData1.userReseller == null || this.profileData1.userReseller == undefined){
          this.isT1ResellerList=true;
          console.log("this.isT1ResellerList for T1"+this.isT1ResellerList);
        }
          if(this.profileData1.userReseller != null || this.profileData1.userReseller != undefined){
             var i;
          for(i=0;i<this.profileData1.userReseller.resellerList.length;i++){
            let changedList= JSON.parse(JSON.stringify(this.profileData1.userReseller.resellerList[i]));
            this.linkIdList.push(changedList);
            console.log("t1linkIdList"+this.linkIdList)
         }}
        this.t1ResellerDataSource = new MatTableDataSource(this.profileData1.userReseller.resellerList);
        this.t1ResellerDataSource.paginator = this.paginator1;
      }, (err) => {
        this.loadingOverlayFlag = false;
      })}
   // }
   // if (this.adminRole == 'T2') {
    getProfileDataT2(){
      console.log("inside T2 User", this.adminRole);
      this.service.getResellerT2ProfileData().subscribe(profileData => {
        this.loadingOverlayFlag = false;
        this.profileData = profileData;
        if(this.profileData.userReseller == null || this.profileData.userReseller == undefined){
         this.isT2ResellerList=true;
         console.log("this.isT2ResellerList for T2"+this.isT2ResellerList)
        }
        this.t2ResellerDataSource = new MatTableDataSource(this.profileData.userReseller.resellerList);
        this.t2ResellerDataSource.paginator = this.paginator2;
      }, (err) => {
        this.loadingOverlayFlag = false;
      });
   // }
  }

  formPoNumber() {
    let newString = new String
    Object.values(this._poNumber).forEach((obj) => newString += obj)
    return newString.length ? newString : null
  }
  submitProfileT1(){
    this.loadingOverlayFlag = true;
    this.cleanProfileDataT1();
    console.log("this.profileData ====>", this.profileData1)
   // if (this.adminRole == 'T1') {
      this.service.submitProfileResellerT1Data(this.profileData1).subscribe((response: any) => {
        if (response == "SUCCESS") {
          this.loadingOverlayFlag = false;
          this.getProfileDataT1();
        }
      },
        (err) => {
          this.loadingOverlayFlag = false;
        });
   //}
  }

  submitProfileT2() {
    this.loadingOverlayFlag = true;
    this.cleanProfileDataT2();
    console.log("this.profileData ====>", this.profileData)
    //  if (this.adminRole == 'T2') {
      this.service.submitProfileResellerT2Data(this.profileData).subscribe((response: any) => {
        if (response == "SUCCESS") {
          this.loadingOverlayFlag = false;
          this.getProfileDataT2();
        }
      },
        (err) => {
          this.loadingOverlayFlag = false;
        });
  //  }
  }

  cancelChangesT1() {
    this.getProfileDataT1();
     }
     cancelChangesT2(){
       this.getProfileDataT2()
      };
  cleanProfileDataT1(){
    this.profileData1.userReseller.resellerList.forEach(element => {
      if (element.hasOwnProperty('emailNewValue')) { element['resEmailId'] = element['emailNewValue'] }
      delete element['updatePO']
      delete element['updateEmail']
      delete element['emailNewValue']
    });
  }
  cleanProfileDataT2() {
    // if (this.adminRole == 'T1') {
    //   this.profileData.userReseller.resellerList.forEach(element => {
    //     if (element.hasOwnProperty('emailNewValue')) { element['resEmailId'] = element['emailNewValue'] }
    //     delete element['updatePO']
    //     delete element['updateEmail']
    //     delete element['emailNewValue']
    //   });
    // }
   // if (this.adminRole == 'T2') {
      this.profileData.userReseller.resellerList.forEach(element => {
        if (element.hasOwnProperty('newResEmailId')) { element['resEmailId'] = element['newResEmailId'] }
        delete element['newResEmailId']
        delete element['updateMail']
      });
    }
 // }

}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { chaseParams } from '../../Model/chaseParams.model';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as saveAs from 'file-saver';


@Component({
  selector: 'app-po-detailstab',
  templateUrl: './po-detailstab.component.html',
  styleUrls: ['./po-detailstab.component.scss']
})
export class PoDetailstabComponent implements OnInit {
  poSubmitedBy: string;
  poSubmitedDate: string;
  poNumber: string;
  subscription: Subscription;
  PoDetails: any[];
  poStartDate: string;
  rowData: any[];
  poExpirationDate: string;
  poStatus: string;
  isDistiFlag: boolean;
  isResellerFlag: boolean;
  tierNameType:string;
  tier:string;
  loadingOverlayFlag: boolean = false;
  isShowResellerDetails:boolean;
  isShowBothTabDetails:boolean;
  isShowPoDetails:boolean;
  constructor(public service: AutorenewService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.loadingOverlayFlag = true;
      this.subscription = this.service.getmessage().subscribe(message => {
      this.PoDetails = message.quoteList;
      if (message != null || message != undefined) {
            }
      this.sendNewPOMessage();
    })
    this.subscription = this.service.getTierType().subscribe(tierType => {
      this.tierNameType=tierType ;
      console.log("this.tierNameType"+this.tierNameType)
        if(this.tierNameType == 'T1'){
    this.isShowBothTabDetails = true;
    console.log("this.isShowBothTabDetails"+this.isShowBothTabDetails )
          }  
          else if(this.tierNameType == 'T2'){
            this.isShowResellerDetails = true;
            console.log("this.isShowResellerDetails"+this.isShowResellerDetails)
          }
          else{
            this.isShowPoDetails=true;
            console.log("this.isShowPoDetails"+this.isShowPoDetails)
          }
        })
  }
  public sendNewPOMessage() {
    this.service.sendPOMessage(this.PoDetails);
  }

}
export interface Element {
  close?: boolean;
}


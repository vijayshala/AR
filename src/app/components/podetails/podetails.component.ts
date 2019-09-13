import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { chaseParams } from '../../Model/chaseParams.model';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as saveAs from 'file-saver';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-podetails',
  templateUrl: './podetails.component.html',
  styleUrls: ['./podetails.component.scss']
})
export class PodetailsComponent implements OnInit, OnDestroy {
  dID: any;
  loadingOverlayFlag: boolean = false;
  result: any = [];
  subscription: Subscription;
  id: string;
  StatusName: string;
  quoteStatusName: string;
  PoDetails: any[];
  rowData: any[];
  dataSource = this.rowData;
  poDetails: any[] = [];
  displayedColumns: string[] = ['quote_id', 'poSubmitedBy', 'poSubmitedDate', 'poNumber', 'poStartDate', 'poAmount', 'poExpirationDate', 'poStatus', 'poDocument'];
  constructor(public service: AutorenewService, public globalDateFormat: globalDateFormat, public router: Router, private route: ActivatedRoute) { }



  ngOnInit() {
  //  this.loadingOverlayFlag = true;
    this.subscription = this.service.getPomessage().subscribe(message => {
     // this.loadingOverlayFlag = false;
      this.PoDetails = message;
      if (message != undefined) {
        this.rowData = message.filter(element => {
          return element.po_submitted_by != null
        });
      }
    })

  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  poDocument(ele: any) {
    this.loadingOverlayFlag = true;
    this.service.poDownloadService(ele).subscribe(data => {
      this.loadingOverlayFlag = false;
      var file = new Blob([data],
        { type: 'application/pdf' });
      saveAs(file, ele + '.pdf');
      var fileURL = window.URL.createObjectURL(file);
      window.open(fileURL);

    });
  }
}
export interface Element {
  close?: boolean;
}
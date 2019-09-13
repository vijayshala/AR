import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { chaseParams } from '../../Model/chaseParams.model';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as saveAs from 'file-saver';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-reseller-podetails',
  templateUrl: './reseller-podetails.component.html',
  styleUrls: ['./reseller-podetails.component.scss']
})
export class ResellerPOdetailsComponent implements OnInit {
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
  displayedColumns: string[] = ['quote_id', 'res_po_submitted_by', 'res_po_submitted_date', 'res_po_number', 'res_po_issue_date', 'res_po_amount', 'res_po_expiry_date', 'res_owcc_id'];
  constructor(public service: AutorenewService, public globalDateFormat: globalDateFormat, public router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  //  this.loadingOverlayFlag = true;
    this.subscription = this.service.getPomessage().subscribe(message => {
      //this.loadingOverlayFlag = false;
      this.PoDetails = message;
      if (message != undefined) {
        this.rowData = message.filter(element => {
          return element.res_po_submitted_by != null
        });
      }
    })

  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  resPoDocument(ele: any) {
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
import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { chaseParams } from '../../Model/chaseParams.model';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { globalDateFormat } from '../../../config/date-format-config';
import { Details } from 'src/app/Model/Details';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ChasedetailsComponent } from '../chasedetails/chasedetails.component';
@Component({
  selector: 'app-auditdetails',
  templateUrl: './auditdetails.component.html',
  styleUrls: ['./auditdetails.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AuditdetailsComponent implements OnInit, OnDestroy {
  loadingOverlayFlag: boolean = false;
  result: any = [];
  subscription: Subscription;
  auditdetails: any = [];
  chaseParams = new chaseParams();
  details: Details;
  chasedetails: ChaseDetails;
  id: string;
  auditMessage:any;
  //ChaseDetailAttributes
  chaseIdValue: String;
  displayedColumns: string[] = ['quote_id', 'action', 'updated_on', 'updated_by','reason','comments'];
  public receivedMessage: any;
  //dataSource = ELEMENT_DATA;

  constructor(public service: AutorenewService,public globalDateFormat: globalDateFormat, public router: Router, private route: ActivatedRoute, public renewdetails: ChasedetailsComponent) {
    this.chasedetails = new ChaseDetails();
    this.details = new Details();
  }

  ngOnInit() {
    this.loadingOverlayFlag = true;
    this.subscription = this.service.getAuditmessage().subscribe(message => {
      this.auditMessage=message;
      if(message!= undefined){
        this.auditMessage.forEach(function(element, key, arr){
          element.comments= String(element.comments).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/n/g,'');       
        })
     
      }
    })
    this.subscription = this.service.getmessage().subscribe(message => {
      this.id = message.autorenew_id;
    })
    this.getAudit(this.id);
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAudit(id: any) {
    this.loadingOverlayFlag = true;
    this.service.getAudit(id).subscribe(
      Data => {
        this.loadingOverlayFlag = false;
        this.result = Data;
      })
  }
}


import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import * as saveAs from 'file-saver';
import { globalDateFormat } from '../../../config/date-format-config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export interface UpComingEvents {
  Event: string;
  Date: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  result: any;
  id: any;
  entity: string;
  autorenewId: string;
  subscription: Subscription;
  EmailSentList: any[];
  UpcomingList: any[];
  displayedColumns: string[] = ['event', 'email_date', 'view_email', 'email_sent', 'email_read_at'];
  dataSource = this.EmailSentList;
  DisplayedColumns: string[] = ['event', 'email_date'];
  DataSource = this.UpcomingList;
  modalRef: BsModalRef;
  message: any;
  status_Id:string;
  errorFlag:boolean=false;

  constructor(public service: AutorenewService,public globalDateFormat: globalDateFormat, private modalService: BsModalService) {
    this.entity = "distributor";
  }

  ngOnInit() {
    this.subscription = this.service.getmessage().subscribe(message => {
      this.autorenewId = message.autorenew_id;
      this.status_Id=message.statusId;
      if(this.status_Id=='17'){
        this.errorFlag=true;
      }
      else{
        this.errorFlag=false;
      }
      this.EmailSentList = message.emailSentList;
      this.UpcomingList = message.upcomingSentList;
    })
  }

  viewMail(ViewEmails: TemplateRef<any>, data:any) {
    this.modalRef = this.modalService.show(ViewEmails);
    this.message = this.htmlToPlaintext(data);
    
  }

  reset(){
//  window.location.reload();
    // sessionStorage.clear();
    this.modalRef.hide()
  }

  htmlToPlaintext(text) {
    var str = String(text).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    //let text = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<meta charset=&quot;ISO-8859-1&quot;>\r\n<title>Insert title here</title>\r\n<link rel = &quot;stylesheet&quot;\r\n   type = &quot;text/css&quot;\r\n   href = &quot;sample_letter.css&quot; />\r\n<script type=&quot;text/javascript&quot;></script>\r\n</head>\r\n<body class=&quot;font_view&quot;>\r\n<!-- header starts from here -->\r\n<div class =&quot;Avaya&quot; align=&quot;right&quot;>\r\n<!--<img alt=&quot;avaya_alt.png&quot; src=&quot;avaya_icon.png&quot;> -->\r\n<img src=&quot;https://renewals-stage.avaya.com/csqt/pochase/static/images/avaya_icon.png&quot; alt=&quot;avaya_alt&quot; />\r\n</div>\r\n<div class=&quot;Commercial1&quot; id=&quot;header&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\nASSET MARKETING SERVICES INC<br>\r\n3344 HWY 149<br>\r\nEAGAN MN 55121<br>\r\nUS<br><br><br>\r\n14-JUN-2017<br><br>\r\n</div>\r\n<div class=&quot;Commercial2&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<b>Reference: PO required for enclosed invoicing statements</b><br>\r\n<b>Payment for the next billing term on your multi-year support agreement</b>  \r\n</div><br><br>\r\n<div style=&quot;font-size:11pt;font-family:Arial&quot;>\r\nDear Customer,<br>\r\n\r\n<p align=&quot;justify&quot;>According to our records, your purchase order for the next year of your multi-year support agreement is due by 10-MAY-2017. \r\n We thank you for your continued commitment to Avaya by signing a multi-year support agreement with Avaya. We trust that you see the great value your support agreement provides by enabling you to protect your investment and ensure peak system performance. By continuing with your multi-year support agreement you will have uninterrupted access to support and maintain this strong foundation by keeping your infrastructure running optimally.  \r\n</p>\r\n</div><br>\r\n<!-- header ends here -->\r\n\r\n<!-- Dynamic content starts from here -->\r\n<div align=&quot;justify&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<p>The payment for the next year of support on your multi-year agreement is now past due. You have until 08-Jul-2017 to make payment or issue a purchase order else support will be suspended effective 09-Jul-2017.</p>\r\n</div><br>\r\n<!-- Dynamic content ends here -->\r\n\r\n<!-- Footer starts from here -->\r\n<div class=&quot;before_footer&quot; align=&quot;justify&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<p>If you have any questions, you can reach out to us at <b> 1-800-328-7833</b> or contact your account manager. Please provide the invoice number in all correspondence. \r\n</p><br>\r\n</div>\r\n\r\n<p style=&quot;font-size:11pt;font-family:Arial&quot;>Payments may be made to Avaya by mailing a check to the lockbox address on the remit portion of the statement or as below:</p><br>\r\n<div style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<table class=&quot;table1&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<tr>\r\n<td>AVAYA INC.</td>\r\n</tr>\r\n<tr>\r\n<td>PO Box 5332</td>\r\n</tr>\r\n<tr>\r\n<td>New York, NY 10087-5332</td>\r\n</tr>\r\n</table><br>\r\nOr through EFT/Wire by using:<br><br>\r\n \r\n<table border=&quot;1&quot; style=&quot;font-size:11pt;font-family:Arial&quot;>\r\n<tr>\r\n<td>ABA Transit Routing #: 021000021</td>\r\n</tr>\r\n\r\n<tr>\r\n<td>Depository: Chase Manhattan Bank</td>\r\n</tr>\r\n\r\n<tr>\r\n<td>Depository Address: New York, NY</td>\r\n</tr>\r\n\r\n<tr>\r\n<td>Credit: Avaya Inc. </td>\r\n</tr>\r\n\r\n<tr>\r\n<td>Account Type: DDA</td>\r\n</tr>\r\n\r\n<tr>\r\n<td>Deposit Account #: 323094724 </td>\r\n</tr>\r\n\r\n</table>\r\n<br><br>\r\nYours sincerely,<br><br>\r\n\r\nAvaya Services Renewals Team <br><br><br>\r\n</div>\r\n</body>\r\n</html>"
    return str;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
 

  summaryStatement() {
    this.service.downloadSummary(this.autorenewId, this.entity).subscribe(Data => {
      this.result = Data;
      let Result = new Blob([this.result],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(Result, this.autorenewId + '_summaryReport.xlsx');
    })
  }
}

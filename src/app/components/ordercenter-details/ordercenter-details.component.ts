import { Component, OnInit } from '@angular/core';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-ordercenter-details',
  templateUrl: './ordercenter-details.component.html',
  styleUrls: ['./ordercenter-details.component.scss']
})
export class OrdercenterDetailsComponent implements OnInit {
  quoteList: any = [];
  filteredList:any=[];
  subscription: Subscription;
  displayedColumns: string[] = ['quote_id', 'web_ref', 'error'];

  constructor(public service: AutorenewService) { }

  ngOnInit() {
    this.subscription = this.service.getmessage().subscribe(message => {
      this.quoteList = message.quoteList;
       if(this.quoteList != undefined){
        this.quoteList =  this.quoteList.filter(element => {
           return element.error_msg != null || element.order_ref_number !=null
   });
 }
 })
  }

}

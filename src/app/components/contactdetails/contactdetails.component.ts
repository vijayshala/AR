import { Component, OnInit, OnDestroy } from '@angular/core';
import { contactdetails } from '../../Model/contactdetails'
import { chaseParams } from '../../Model/chaseParams.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { Subscription } from 'rxjs';
import { Payer } from '../../Model/payer';
import { ChasedetailsComponent } from "../chasedetails/chasedetails.component";
@Component({
  selector: "app-contactdetails",
  templateUrl: "./contactdetails.component.html",
  styleUrls: ["./contactdetails.component.scss"]
})
export class ContactdetailsComponent implements OnInit {
  is_RESELLER: string = "N";
  subscription: Subscription;
  poPromiseflag: Boolean = false;
  IsclickButton: boolean = false;
  Contactdetails: contactdetails;
  data = new Payer();
  contactmodel = new contactdetails();
  contact_no: any;
  emails: any = [""];
  phone_no: any;
  status:string;
  payer_Id: string;
  quotelist: any[];
  result: any = [];
  id: string;
  ContactdetailsList: any[];
  contactDataTosave: contactdetails;
  loadingOverlayFlag: boolean;
  errorFlag: string;

  constructor(
    public service: AutorenewService,
    public router: Router,
    private route: ActivatedRoute,
    public chasedetailsComponent: ChasedetailsComponent
  ) {
    this.ContactdetailsList = new Array<contactdetails>();
    this.Contactdetails = new contactdetails();
    this.Contactdetails.payer_id = this.payer_Id;
  }

  ngOnInit() {
    this.subscription = this.service.getmessage().subscribe(message => {
      this.is_RESELLER = message.is_RESELLER;
      this.status=message.statusName;
      this.quotelist = message.quoteList;
      this.data.payer_id = message.payer;
      this.Contactdetails.payer_id = message.payer;
      this.Contactdetails.new_payer = message.new_payer;
      if (message.new_payer) {
        this.getdata();
      }
    });
    this.getdata();
  }

  trackByFn(index, item) {
    return index;
  }

  add() {
    this.IsclickButton = true;
    // let last:any = this.Contactdetails.emails[this.Contactdetails.emails.length-1];
    let last = this.Contactdetails.emails.filter(data => data == "")
    if(last.length < 1) {
      this.Contactdetails.emails.push("");
      this.errorFlag = "";
    }
    else this.errorFlag = "Field cannot be blank"
  }

  deleteOption(items: any) {
    if(this.Contactdetails.emails && this.Contactdetails.emails.length > 1) {
      this.Contactdetails.emails.splice(items, 1 );
      this.errorFlag = "";
    }
    else this.errorFlag = "Atleast one email Id is required"

    // this.Contactdetails.emails.splice(
    //   this.Contactdetails.emails.indexOf(items),
    //   1
    // );
  }

  checkValidation(){
    let list = this.Contactdetails.emails.filter(data => data == "")
    if(list.length > 0) return true
    else return false;
  }

  getdata() {
    if (this.Contactdetails.new_payer != null) {
      let postData = {
        contact_no: "",
        emails: [""],
        payer_id: this.Contactdetails.new_payer,
        phone_no: ""
      };
      this.service.getcontactdata(postData).subscribe(Data => {
        this.Contactdetails = Data;
        // this.contact_no = this.result.contact_no;
        // this.phone_no = this.result.phone_no;
        // this.emails = this.result.emails;
        // this.Contactdetails.phone_no = this.phone_no;
        // this.Contactdetails.contact_no = this.contact_no;
        // this.Contactdetails.emails = this.emails;
      });
    }
    if (this.Contactdetails.new_payer == null) {
      let postData = {
        contact_no: "",
        emails: [""],
        payer_id: this.Contactdetails.payer_id,
        phone_no: ""
      };
      this.service.getcontactdata(postData).subscribe(Data => {
        this.Contactdetails = Data;
        // this.result = Data;
        // this.contact_no = this.result.contact_no;
        // this.phone_no = this.result.phone_no;
        // this.emails = this.result.emails;
        // this.Contactdetails.phone_no = this.phone_no;
        // this.Contactdetails.contact_no = this.contact_no;
        // this.Contactdetails.emails = this.emails;
      });
    }
  }

  save() {
    if (this.Contactdetails.new_payer) {
      this.Contactdetails.payer_id = this.Contactdetails.new_payer;
    } else {
      this.Contactdetails.payer_id = this.Contactdetails.payer_id;
    }
    this.loadingOverlayFlag = true;

    this.service.postcontactdata(this.Contactdetails).subscribe(data => {
      this.loadingOverlayFlag = false;
    },
      error => {
        this.loadingOverlayFlag = false;
      },
      () => {
        this.getdata();
      });
    // this.contactDataTosave = new contactdetails();
    // this.contactDataTosave = JSON.parse(JSON.stringify(this.Contactdetails));
    // this.ContactdetailsList.push(this.contactDataTosave);
  }

  cancel() {
    // window.location.reload();
    this.chasedetailsComponent.ngOnInit();
  }
}

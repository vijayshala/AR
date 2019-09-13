import { Component, OnInit, Inject, Input } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ChaseDetails } from 'src/app/Model/chaseDetails';
import { AutorenewService } from 'src/app/services/autorenew.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDetailRowDirective } from 'src/app/shared/cdk-detail-row.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { LoaderService } from '../../services/loader.service';
import { Subscription } from 'rxjs';
import { QuoteDetails } from 'src/app/Model/quoteDetails';
import { UploadData } from 'src/app/Model/uploaddata';
import { ToastrService } from 'ngx-toastr';
import { element } from '@angular/core/src/render3';
import * as moment from 'moment';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: 'app-details-reseller-dialog',
  templateUrl: './details-reseller-dialog.component.html',
  styleUrls: ['./details-reseller-dialog.component.scss']
})
export class DetailsResellerDialogComponent implements OnInit {
  loadingOverlayFlag: boolean = false;
  isReadOnly: boolean = true;
  minDate = new Date();
  public isCollapsed = {};
  public allItems = [
    {
      checked: true,
      chaseID: "CHD2345656",
      Tier1: "Tier1",
      Tier2: "Tier2",
      payer: "payer 1",
      lastNotificationDate: "12/08/2018",
      modifiedDate: "12/09/2018",
      total: "$200.00",
      quote_id: "Q-123456",
      contractnumber: "543210"
    }
  ];
  subdisplayedColumns: string[] = [
    "quote_id",
    "expiring_contractnumber",
    "contract_expiry_date",
    "includePromotion",
    "quoteSubStatusName",
    "total_contract_value",
    "Quote_status",
    "resellerPOAmount",
    "resellerPOValue",
    "resellerPODocument"
  ];
  uploadType: any = ["Signed PO", "PO Letter", "PO Voucher"];
  uploadFile: any;
  fileName: String = "";
  uploadButton = true;
  public quotesDetails: any;
  public selectedDate: any;
  public selectUploadtype: any;
  public selectedPoNumber: any;
  public selectedPoAmount: any;
  public get_dID: any;
  public fileFormatError: boolean = false;
  public fileFormatErrorMassage: string =
    "File format Not Valid. Please upload PDF file";
  defaultChecked = true;
  subscription: Subscription;
  public quotedata: any[] = [];
  autorenewData: any;
  quoteDetails: Array<QuoteDetails>;
  quoteDetailsObj: any;
  selectedquoteList: any;
  uploaddata: UploadData;
  selectquoteid: any = [];
  uploadeDone: boolean = true;
  chasedetails: any;
  result: any;
  porequired: any;
  id: any
  selectedPoNumbers:any;
  quote_price: any;
  POFiledsRequired: string = "Y";
  quoteListdetails: any;
  quoteEndDate: string;

  constructor( private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,public globalDateFormat: globalDateFormat,
    public dialogRef: MatDialogRef<DetailsResellerDialogComponent>,
    public service: AutorenewService,
    public loader: LoaderService,
    public toaster: ToastrService) {
      this.uploaddata = new UploadData();
     }

  ngOnInit() {
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.subscription = this.service.getmessage().subscribe(message => {
     this.chasedetails=message;
     this.id=this.chasedetails.autorenew_id;
            if(message != undefined){
     this.quoteListdetails = message.quoteList[0];
      this.quoteEndDate = this.quoteListdetails.quote_end_date;
     this.selectedPoNumbers=this.quoteListdetails.expiring_ponumber;
          }
     this.selectedDate = moment(this.quoteEndDate).format('MM/DD/YYYY');
    // this.porequired = this.chasedetails.po_required;
    //  this.id = message.autorenew_id;
   })
     this.quotesList(this.id);
 }

  quotesList(id: any) {
    this.loadingOverlayFlag = true;
    this.service.chaseDetails(id).subscribe(
      data => {
        this.loadingOverlayFlag = false;
        this.result = data;
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = this.result;
        this.quoteDetailsObj.forEach(element => {
          if (element.quote_id === this.data.quote_id) {
            this.quoteDetails.push(element);
          }
        });
        this.quoteDetails.forEach(element => {
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
        });
        this.quoteDetails.filter(x => {
          this.quote_price = parseFloat(x.avaya_net_price);
        })
        // console.log('this.quote_price', this.quote_price);
      },
      error => {
        this.loadingOverlayFlag = false;
      },
    );
  }

  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.uploadFile = files[0];
    this.fileName = this.uploadFile.name;

    if (this.uploadFile != undefined && this.uploadFile != "") {
      this.uploadButton = true;
      this.fileFormatError = false;
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(this.uploadFile.name)[1];
      var validExt = ["pdf"];
      if (validExt.indexOf(ext) > -1) {
        this.fileFormatError = true;
        this.uploadButton = false;
      } else {
        this.fileFormatError = false;
        this.uploadButton = true;
      }
    }
  }

  btnclickedBrowse() {
    let element: HTMLElement = document.getElementById(
      "browsefile"
    ) as HTMLElement;
    element.click();
  }

  uploadBtn() {
    var re = /(?:\.([^.]+))?$/;
    if (this.uploadFile != undefined && this.uploadFile != "") {
      this.upload();
    }
  }

  upload() {
    this.loadingOverlayFlag = true;
    var fd = new FormData();
    fd.append("file", this.uploadFile);

    this.quoteDetails.forEach(element => {
      this.selectedquoteList = new Array<QuoteDetails>();
      this.selectedquoteList.push(element);
    });

    this.service.uploadPO(this.chasedetails.autorenew_id, this.uploadFile, this.selectedquoteList)
      .subscribe((result: any) => {
        this.loadingOverlayFlag = false;
        this.uploaddata = result;
        this.get_dID = this.uploaddata["dID"];
        this.uploadeDone = false;
      });
  }

  submit() {
    this.loadingOverlayFlag = true;
     this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');
    this.uploaddata.selectedQuoteList = this.quoteDetails;
    this.uploaddata.autorenewId = this.chasedetails.autorenew_id;
    this.uploaddata.poExpiryDate = this.selectedDate
    this.uploaddata.poAmount = this.selectedPoAmount;
   // this.uploaddata.poRequired = this.POFiledsRequired;
    this.uploaddata.poNumber = this.selectedPoNumber;
    // if(this.POFiledsRequired == 'Y'){
    // this.uploaddata.poNumber = this.selectedPoNumber;
    // console.log("porequiredflags == 'y':::::"+this.uploaddata.poNumber)
    // }
    // else{
    //   this.uploaddata.poNumber =this.selectedPoNumbers ;
    //   console.log("porequiredflags == 'N':::::"+this.uploaddata.poNumber)
    // }
  

    this.service.resellerpoSubmitServices(this.uploaddata)
      .subscribe(
        (response: any) => {
          this.loadingOverlayFlag = false;
          this.dialogRef.close();
          this.toaster.success('PO submitted!!!');
          window.location.reload();
        },
        err => {
          this.loadingOverlayFlag = false;
          this.dialogRef.close();
        },
        () => {

        }
      );
  }


  Cancel() {
    this.dialogRef.close();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  checkAllField() {
    if (this.POFiledsRequired == 'N') {
      this.uploadeDone = false;
      return false;
    }
    if (this.POFiledsRequired == 'Y') {
      if (
        // (this.selectedDate == "" || this.selectedDate == undefined) ||
        (this.selectUploadtype == "" || this.selectUploadtype == undefined) ||
        (this.selectedPoNumber == "" || this.selectedPoNumber == undefined) ||
        (this.selectedPoAmount == "" || this.selectedPoAmount == undefined) ||
        (this.selectedPoAmount < this.quote_price)
      ) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}

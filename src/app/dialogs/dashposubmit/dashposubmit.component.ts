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
import * as saveAs from 'file-saver';
import { globalDateFormat } from '../../../config/date-format-config';
@Component({
  selector: "app-dashposubmit",
  templateUrl: "./dashposubmit.component.html",
  styleUrls: ["./dashposubmit.component.scss"]
})
export class DashposubmitComponent implements OnInit {
  loadingOverlayFlag: boolean = false;
  isReadOnly: boolean = true;
  minDate = new Date();
  public isCollapsed = {};
  public allItems = [{ "checked": true }];
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
  tier1: string;
  tier2: string;
  checkedflag: boolean;
  totalquotes_price: any;
  selectAllFlag: boolean = true;
  POFiledsRequired: string = "Y";
  selectedPoNumbers: any;
  result: any;
  quotesResult: any;
  quoteEndDate: string;
  poAmountErrorFlag: boolean = false;
  isDistiFlag: boolean;
  optInFlag: boolean;
  optOutFlag: boolean;
  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, public globalDateFormat: globalDateFormat,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DashposubmitComponent>,
    public service: AutorenewService,
    public loader: LoaderService,
    public toaster: ToastrService
  ) {
    this.uploaddata = new UploadData();
  }

  ngOnInit() {
    console.log("this.data ==>", this.data)
    this.isDistributor();
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.PORequiredFlag();
    this.quotesList();

    if (this.data.previous_reminder_date != null && this.data.updatedOn != null) {
      this.data.previous_reminder_date = moment(this.data.previous_reminder_date).format('MM/DD/YYYY');
      this.data.updatedOn = moment(this.data.updatedOn).format('MM/DD/YYYY');
    }
    if (this.data.t1name || this.data.t2name) {
      this.tier1 = this.data.t1name;
      this.tier2 = this.data.t2name;
    }
    else {
      this.tier1 = this.data.tier1;
      this.tier2 = this.data.tier2;
      for (let j = 0; j <= this.tier2.length; j++) {
        if (this.tier2.charAt(j) == '&') {

          let str1: any;
          let str2: any;
          str1 = this.tier2.slice(0, j);
          str2 = this.tier2.slice(j + 5, this.tier2.length);
          let moifiedvariable = str1 + '&' + str2;
          this.tier2 = moifiedvariable;

        }
      }
      for (let j = 0; j <= this.tier1.length; j++) {
        if (this.tier1.charAt(j) == '&') {

          let str1: any;
          let str2: any;
          str1 = this.tier1.slice(0, j);
          str2 = this.tier1.slice(j + 5, this.tier1.length);
          let moifiedvariable = str1 + '&' + str2;
          this.tier1 = moifiedvariable;

        }
      }
    }
  }

  isDistributor() {
    let userType: any;
    let accountType = sessionStorage.getItem("userType");
    if (accountType != null && accountType != "" && accountType.length > 0) {
      userType = JSON.parse(accountType);
      if (userType.is_DISTRIBUTOR == 'Y') this.isDistiFlag = true;
      else this.isDistiFlag = false;
    }
  }

  PORequiredFlag() {
    let payer = "";
    if (this.data.new_payer == null) payer = this.data.payer;
    else payer = this.data.new_payer;
    this.service.poRequiredFlag(this.data.autorenew_id, payer, this.data.t1soldto).subscribe(data => {
      this.POFiledsRequired = data["PORequired"];
    });

  }

  checkboxLabel(row) {
    // if (!row) {
    //   return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    // }
    // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.chase_id + 1}`;
  }

  checkAllField() {
    // if (this.POFiledsRequired == 'N') {
    //   this.uploadeDone = false;
    //   let quoteDetailsObj = [];
    //   this.quoteDetails.filter(quote => {
    //     if (quote.checked == true && (quote.quote_sub_status == '5' || quote.quote_sub_status == '7')) {
    //       quoteDetailsObj.push(quote);
    //     }
    //   });
    //   if (quoteDetailsObj.length > 0) return false
    //   return true;
    // }
    // if (this.POFiledsRequired == 'Y') {
    if (this.POFiledsRequired == 'N') {
      this.uploadeDone = false;
      return false;
    }
    if (this.POFiledsRequired == 'Y') {
      if ((this.selectedDate == "" || this.selectedDate == undefined ||
        this.selectUploadtype == "" || this.selectUploadtype == undefined) ||
        (this.selectedPoNumber == "" || this.selectedPoNumber == undefined) ||
        (this.selectedPoAmount == "" || this.selectedPoAmount == undefined) ||
        (this.totalquotes_price == undefined || this.totalquotes_price > this.selectedPoAmount)
      ) {
        return true;
      } else {
        return false;
      }
    }
    // }
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

    this.service.uploadPO(this.data.autorenew_id, this.uploadFile, this.selectedquoteList)
      .subscribe((result: any) => {
        this.loadingOverlayFlag = false;
        this.uploaddata = result;
        this.get_dID = this.uploaddata["dID"];
        this.uploadeDone = false;
      },
        error => {
          if (error.statusCode == 500) {
            this.loadingOverlayFlag = false;
          }
          this.loadingOverlayFlag = false;
        });
  }

  onChangeCheckbox(quoteId: any, isChecked: any) {
    this.totalquotes_price = 0;
    var checkboxFlag = [];
    if (isChecked == true) {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) {
          element.checked = true;
        }
      });
    } else {
      this.quoteDetails.forEach(element => {
        if (element.quote_id == quoteId) {
          element.checked = false;
        }

      });
    }
    this.quoteDetails.forEach(element => {
      if (element.checked == true && (element.quote_sub_status == '5' || element.quote_sub_status == '7' || element.quote_sub_status == '19')) checkboxFlag.push(element);
    })
    let total = 0;
    if (checkboxFlag.length > 0) {
      this.selectAllFlag = true
      checkboxFlag.filter(x => {
        let netPrice = Number(x.avaya_net_price)
        total = total + netPrice;
      })
      let grandTotal = total.toFixed(2);
      this.totalquotes_price = Number(grandTotal);
      console.log("totalquotes_price ==>", this.totalquotes_price);
    }
    else this.selectAllFlag = false;
  }

  submit() {
    this.loadingOverlayFlag = true;
    let quoteDetailsObj = [];
    this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');
    this.quoteDetails.filter(quote => {
      if (quote.checked == true && (quote.quote_sub_status == '5' || quote.quote_sub_status == '7' || quote.quote_sub_status == '19')) {
        quoteDetailsObj.push(quote);
      }
    });
    this.uploaddata.selectedQuoteList = quoteDetailsObj;
    this.uploaddata.autorenewId = this.data.autorenew_id;
    this.uploaddata.poAmount = this.selectedPoAmount;
    if (this.POFiledsRequired == 'Y') {
      this.uploaddata.poNumber = this.selectedPoNumber;
      console.log("porequiredflags == 'y':::::" + this.uploaddata.poNumber)
    }
    else {
      this.uploaddata.poNumber = this.selectedPoNumbers;
      console.log("porequiredflags == 'N':::::" + this.uploaddata.poNumber)
    }
    //  this.uploaddata.poNumber = this.selectedPoNumber;
    this.uploaddata.poRequired = this.POFiledsRequired;
    this.uploaddata.poExpiryDate = this.selectedDate;
    this.service.poSubmitServices(this.uploaddata)
      .subscribe(
        (response: any) => {
          this.loadingOverlayFlag = false;
          this.dialogRef.close();
          this.toaster.success('PO submitted!!!');
        },
        err => {
          this.loadingOverlayFlag = false;
          this.dialogRef.close();
        },
        () => { }
      );

  }

  selectAll(value: any) {
    if (value == true) {
      this.quoteDetails.forEach(element => {
        if (element.is_eligible === 'Y' && (element.quote_sub_status == "5" || element.quote_sub_status == "7" || element.quote_sub_status == '19' )) element.checked = true;
        // else element.checked = false
      })
    } else {
      this.quoteDetails.forEach(element => {
        if (element.is_eligible === 'Y' && (element.quote_sub_status == "5" || element.quote_sub_status == "7" || element.quote_sub_status == '19' )) element.checked = false;
        // else element.checked = false
      })
    }
  }

  Cancel() {
    // this.snackBar.open('You can still optin before your contract expires', 'okay', {
    //   duration: 3000
    // });
    this.dialogRef.close();
  }

  quotesList() {
    this.loadingOverlayFlag = true;
    var chaseId = this.data.autorenew_id;
    this.service.chaseDetails(chaseId).subscribe(
      data => {
        this.result = data;
        this.quotesResult = this.result[0];
        this.quoteEndDate = this.quotesResult.quote_end_date;
        this.selectedDate = moment(this.quoteEndDate).format('DD-MMM-YYYY');
        this.selectedPoNumbers = this.quotesResult.expiring_ponumber
        this.loadingOverlayFlag = false;
        this.quoteDetails = new Array<QuoteDetails>();
        this.quoteDetailsObj = data;
        this.quoteDetailsObj.forEach(element => {
          this.quoteDetails.push(element);
          this.quoteDetails.forEach(element => {
            // console.log("element => ",element)
            if (element.quote_sub_status == '6') {
              this.optInFlag = true;
            } else {
              this.optInFlag = false;

            }
            if (element.quote_sub_status == '5' || element.quote_sub_status == '7' || element.quote_sub_status == '19' ) {
              this.optOutFlag = true;

            } else {
              this.optOutFlag = false;

            }
            if (element.is_eligible === 'Y' && (element.quote_sub_status == "4" || element.quote_sub_status == "5" || element.quote_sub_status == "7" || element.quote_sub_status == "8" || element.quote_sub_status == "10" || element.quote_sub_status == "11" || element.quote_sub_status == "19")) element.checked = true;
            else element.checked = false;
          });
        });

        // for enable and Disable chase level checkbox
        var checkboxFlag = [];
        let total = 0;
        this.quoteDetails.forEach(element => {
          element.contract_expiry_date = moment(element.contract_expiry_date).format('MM/DD/YYYY');
          if (element.checked == true && (element.quote_sub_status == "5" || element.quote_sub_status == "7" || element.quote_sub_status == '19' )) checkboxFlag.push(element);
        });

        if (checkboxFlag.length > 0) {
          this.selectAllFlag = true
          checkboxFlag.filter(x => {
            let netPrice = Number(x.avaya_net_price)
            total = total + netPrice;
          })
          let grandTotal = total.toFixed(2);
          this.totalquotes_price = Number(grandTotal);
          console.log("totalquotes_price ==>", this.totalquotes_price);
        }
        else this.selectAllFlag = false;
      },
      error => {
        this.loadingOverlayFlag = false;
      },
      () => { }
    );
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;
  }

  quoteCheckBoxDisable(is_eligible: string, quote_sub_status: string) {
    if (is_eligible == 'Y' && (quote_sub_status == '5' || quote_sub_status == '7' || quote_sub_status == '19')) return false
    else return true;
  }

  poDocumentDownload(record: any) {
    this.loadingOverlayFlag = true;
    this.service.poDownloadService(record).subscribe(data => {
      this.loadingOverlayFlag = false;
      var file = new Blob([data],
        { type: 'application/pdf' });
      saveAs(file, record + '.pdf');
      var fileURL = window.URL.createObjectURL(file);
      window.open(fileURL);

    });
  }
}


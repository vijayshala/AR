import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import { environment } from '../../environments/environment.dev';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { chaseParams } from '../Model/chaseParams.model';
import { Payer } from '../Model/payer';
import { Popromisemodel } from '../Model/popromisemodel';
import { contactdetails } from '../Model/contactdetails';
import { UploadData } from '../Model/uploaddata';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})

export class AutorenewService {
  // public adminRoleAPI: string = "/assets/data/adminRole.json";
  // public resellerJosn: string = "/assets/data/reseller.json";
  [x: string]: any;
  public messageSource = new BehaviorSubject<any>(undefined);
  public poMessageSource = new BehaviorSubject<any>(undefined);
  public auditMessage = new BehaviorSubject<any>(undefined);
  public t1soldTo = new BehaviorSubject<any>(undefined);
  public startDate = new BehaviorSubject<any>(undefined);
  public endDate = new BehaviorSubject<any>(undefined);
  public searchText = new BehaviorSubject<any>(undefined);
  public autorenewal = new BehaviorSubject<any>(undefined);
  public freeze = new BehaviorSubject<any>(undefined);
  public PoSubmitVisible = new BehaviorSubject<any>(undefined)
  public resellerFlag = new BehaviorSubject<any>(undefined);
  public arId = new BehaviorSubject<any>(undefined);
  public tierNameType = new BehaviorSubject<any>(undefined)

  public setARID(Id) {
    this.arId.next(Id);
  }

  public getARID(): Observable<any> {
    return this.arId.asObservable();
  }

  public PoSubmitVisibleflag(PoSubmitVisible: any) {
    this.PoSubmitVisible.next(PoSubmitVisible);
  }

  public TierType(tierNameType: any) {
    this.tierNameType.next(tierNameType);
  }
  public reseller_flag(flag: any) {
    this.resellerFlag.next(flag);
  }

  public sendNewMessage(message: any, t1soldtoid: any) {
    this.messageSource.next(message);
    this.t1soldTo.next(t1soldtoid);
  }
  public sendPOMessage(message: any) {
    this.poMessageSource.next(message);
    // this.t1soldTo.next(t1soldtoid);
  }
  public sendAuditMessage(message: any, t1soldtoid: any) {
    this.auditMessage.next(message);
    this.t1soldTo.next(t1soldtoid);
  }

  public filters(startDate: any, endDate: any, searchText: any) {
    this.startDate.next(startDate);
    this.endDate.next(endDate);
    this.searchText.next(searchText);
  }

  public getDatesAuto_freeze(autorenewal: any, freeze: any) {
    this.autorenewal.next(autorenewal);
    this.freeze.next(freeze);
  }

  getResellerFlag(): Observable<any> {
    return this.resellerFlag.asObservable();
  }
  getTierType(): Observable<any> {
    return this.tierNameType.asObservable();
  }
  getFreezeDate(): Observable<any> {
    return this.freeze.asObservable();
  }
  getAutorenewal(): Observable<any> {
    return this.autorenewal.asObservable();
  }

  getmessage(): Observable<any> {
    return this.messageSource.asObservable();
  }
  getPomessage(): Observable<any> {
    return this.poMessageSource.asObservable();
  }
  getAuditmessage(): Observable<any> {
    return this.auditMessage.asObservable();
  }

  getID(): Observable<any> {
    return this.t1soldTo.asObservable();
  }

  getstartDate(): Observable<any> {
    return this.startDate.asObservable();
  }

  getendDate(): Observable<any> {
    return this.endDate.asObservable();
  }

  getsearchText(): Observable<any> {
    return this.searchText.asObservable();
  }
  getPoSubmitVisibleflag(): Observable<any> {
    return this.PoSubmitVisible.asObservable();
  }
  apiUrl = environment.APIEndpoint;
  public assetsUrl: any;

  constructor(private http: HttpClient) { }

  getPendingChaseData(pageNumber: number, pageSize: number, queryObject) {
    console.log("Service inside ==> ", queryObject)
    let apiTerminal = ""
    let parameters = "";
    if (queryObject && queryObject.filterType != undefined) apiTerminal = queryObject.filterType;
    if (apiTerminal == 'date') {
      parameters = "&filterType=" + queryObject.filterType + "&startDate=" + queryObject.startDate + "&endDate=" + queryObject.endDate;
    }
    if (apiTerminal == "t1linkId" || apiTerminal == "t2linkId" || apiTerminal == "text") {
      parameters = "&filterType=" + queryObject.filterType + "&searchString=" + queryObject.searchString;
    }
    return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + queryObject.status + parameters).pipe(map((user: any) => user));

  }
  getOrderedChaseData(pageNumber: number, pageSize: number, queryObject) {
    console.log("Service inside ==> ", queryObject)
    let apiTerminal = ""
    let parameters = "";
    if (queryObject && queryObject.filterType != undefined) apiTerminal = queryObject.filterType;
    if (apiTerminal == 'date') {
      parameters = "&filterType=" + queryObject.filterType + "&startDate=" + queryObject.startDate + "&endDate=" + queryObject.endDate;
    }
    if (apiTerminal == "t1linkId" || apiTerminal == "t2linkId" || apiTerminal == "text") {
      parameters = "&filterType=" + queryObject.filterType + "&searchString=" + queryObject.searchString;
    }
    return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + queryObject.status + parameters).pipe(map((user: any) => user));

  }


  _getCheseData(pageNumber: number, pageSize: number, queryObject) {
    let apiTerminal = queryObject.filterType;

    if (apiTerminal == 'date') {
      console.log("date == >>>")
      return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + queryObject.status + "&filterType=" + queryObject.filterType + "&startDate=" + queryObject.startDate + "&endDate=" + queryObject.endDate).pipe(map((user: any) => user));
    } else if (apiTerminal == "t1linkId") {
      console.log("t1linkid == >>>")
      return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + queryObject.status + "&filterType=" + queryObject.filterType + "&searchString=" + queryObject.searchString).pipe(map((user: any) => user));
    } else if (apiTerminal == "t2linkId") {
      console.log("t2linkid == >>>")
      return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + queryObject.status + "&filterType=" + queryObject.filterType + "&searchString=" + queryObject.searchString).pipe(map((user: any) => user));
    }
  }
  getCheseData(pageNumber: number, pageSize: number, status: any, filterType: string, searchString: string, startDate: string, endDate: string) {
    let parameters = "";

    if (filterType == 'text' || filterType == 'date') {
      parameters = parameters + '&filterType=' + filterType;
    }
    if (searchString != null && searchString != undefined && searchString != '') {
      parameters = parameters + "&searchString=" + searchString;
    }
    if (startDate != null && endDate != null && startDate != undefined && endDate != undefined && startDate != '' && endDate != '') {
      parameters = parameters + "&startDate=" + startDate + "&endDate=" + endDate;
    }
    return this.http.get(this.apiUrl + "chases?pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&status=" + status + parameters).pipe(map((user: any) => user));
  }

  chaseDetails(id: any) {
    return this.http.get(this.apiUrl + "chase/quotes/" + id);
  }
  downloadSummary(autorenewId: any, entity: any): Observable<any> {

    let getfileheaders = new HttpHeaders().set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    return this.http.get(this.apiUrl + "chase/download/summaryreport/" + entity + "/" + autorenewId, { responseType: 'blob', headers: getfileheaders });
  }

  exportAllDataService(status: string, filterType: string, searchString: string, startDate: any, endDate: any, t1linkIdSearchValue: any, t2linkIdSearchValue: any) {
    let parameters = "";
    if (filterType == 'text' || filterType == 'date' || filterType == 't1linkId' || filterType == 't2linkId') {
      parameters = parameters + '&filterType=' + filterType;
    }
    if (startDate != null && endDate != null && startDate != undefined && endDate != undefined && startDate != '' && endDate != '') {
      parameters = parameters + "&startDate=" + startDate + "&endDate=" + endDate;
    }
    if (searchString != null && searchString != undefined && searchString != '') {
      parameters = parameters + "&searchString=" + searchString;
    }
    if (t1linkIdSearchValue != null && t1linkIdSearchValue != undefined && t1linkIdSearchValue != '') {
      parameters = parameters + "&searchString=" + t1linkIdSearchValue;
    }
    if (t2linkIdSearchValue != null && t2linkIdSearchValue != undefined && t2linkIdSearchValue != '') {
      parameters = parameters + "&searchString=" + t2linkIdSearchValue;
    }

    let getfileheaders = new HttpHeaders().set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.get(this.apiUrl + "chases/report/download?status=" + status + parameters, { responseType: 'blob', headers: getfileheaders });
  }
  getchasedetails(id: any) {
    return this.http.get(this.apiUrl + "chase/" + id);
  }

  optInService(chaseid: any, optRequest: any) {
    return this.http.post(
      // this.apiUrl + 'chase/' + chaseid + '/optin', optRequest
      this.apiUrl + 'chase/optin', optRequest
    );
  }

  optOutService(chaseid, optRequest) {
    return this.http.post(
      // this.apiUrl + 'chase/' + chaseid + '/optout', optRequest
      this.apiUrl + 'chase/optout', optRequest
    );
  }


  poPromiseService(chaseid, date) {
    const body = JSON.stringify(date);
    return this.http.post(
      this.apiUrl + 'chase/' + chaseid + '/popromise', body, this.getArgHeaders()
    );
  }

  poSubmitServices(uploaddata: UploadData) {
    return this.http.post(
      this.apiUrl + 'chase/posubmit', uploaddata, this.getArgHeaders()
    );
  }
  resellerpoSubmitServices(uploaddata: UploadData) {
    return this.http.post(
      this.apiUrl + 'chase/reseller/posubmit', uploaddata, this.getArgHeaders()
    );
  }
  uploadPO(chaseid: any, fileToUpload: any, quoteList: any) {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('selectedQuoteList', new Blob([JSON.stringify(quoteList)], { type: "application/json" }));
    return this.http.post(this.apiUrl + 'chase/' + chaseid + '/document/upload', formData, this.fileUploadHeaders());
  }

  getAudit(id: any) {
    return this.http.get(this.apiUrl + "chase/audit/" + id);
  }

  getAssetsUrl() {
    if (isDevMode()) {

      return this.assetsUrl = '/assets/';
    } else {

      return this.assetsUrl = 'static/assets/';
    }
    // this.assetsUrl = 'static/assets/';
  }

  getcontactdata(model: any): Observable<any> {
    const httpBody = new HttpParams()
    const body = JSON.stringify(model);
    return this.http.post("/csqt/autorenew/autorenew-api/payer/contact", body, this.getArgHeaders());
  }

  private getArgHeaders(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }
  postcontactdata(model: contactdetails): Observable<any> {
    const httpBody = new HttpParams()
    const body = JSON.stringify(model);
    let postData = {
      "contact_no": model.contact_no,
      "emails": model.emails,
      "payer_id": model.payer_id,
      "phone_no": model.phone_no
    }
    return this.http.post("/csqt/autorenew/autorenew-api/payer/contact/update", postData, this.getArgHeaders1());
  }

  private getArgHeaders1(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }

  private fileUploadHeaders(): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    };
    return httpOptions;
  }

  payerList(customerId: any, autorenewId: any, ) {
    return this.http.get(this.apiUrl + 'changePayer?customerId=' + customerId + '&autoRenewId=' + autorenewId);
  }

  changePayerService(payer: Payer) {
    return this.http.post(this.apiUrl + 'updatePayer', payer);
  }

  getMasterAutorenewList(autoRenewList: any) {
    // chases/dashboard/optoutlist 
    return this.http.post(this.apiUrl + 'chases/dashboard/optoutlist', autoRenewList, this.getArgHeaders());
  }

  poRequiredFlag(autorenewId: any, payer: any, t1SoldTo: any) {
    return this.http.post(this.apiUrl + "chases/AutoRenewPayerOB?autorenewId=" + autorenewId + "&payer=" + payer + "&t1SoldTo=" + t1SoldTo, this.getArgHeaders());
  }
  poDownloadService(ele: any): Observable<Blob> {
    let getfileheaders = new HttpHeaders().set('Accept', 'application/pdf')

    return this.http.get(this.apiUrl + "chase/download/podocument/" + ele,
      { responseType: 'blob', headers: getfileheaders });
  }

  getProfileDistData() {
    // return this.http.get(this.resellerJosn).pipe(map((user: any) => user));
    return this.http.get(this.apiUrl + "admin/distributor").pipe(map((user: any) => user)); 
  }

  submitProfileDistData(data) {
    const bodyData = JSON.stringify(data);
    return this.http.post(
      this.apiUrl + "admin/submit/distributor", bodyData, this.getArgHeaders()
    );
  }

  submitProfileResellerData(data) {
    const bodyData = JSON.stringify(data);
    return this.http.post(
      this.apiUrl + "admin/submit/reseller", bodyData, this.getArgHeaders()
    );
  }

  submitProfileResellerT1Data(data) {
    const bodyData = JSON.stringify(data);
    return this.http.post(
      this.apiUrl + "admin/submit/resellerT1", bodyData, this.getArgHeaders()
    );
  }

  submitProfileResellerT2Data(data) {
    const bodyData = JSON.stringify(data);
    return this.http.post(
      this.apiUrl + "admin/submit/resellerT2", bodyData, this.getArgHeaders()
    );
  }

  getResellerT1ProfileData() {
    // return this.http.get(this.resellerJosn).pipe(map((user: any) => user));
    return this.http.get(this.apiUrl + "admin/resellerT1").pipe(map((user: any) => user));

  }

  getResellerT2ProfileData() {
    // return this.http.get(this.resellerJosn).pipe(map((user: any) => user));
    return this.http.get(this.apiUrl + "admin/resellerT2").pipe(map((user: any) => user));

  }


  adminRole() {
    // return this.http.get(this.adminRoleAPI).pipe(map((user: any) => user));
    return this.http.get("/csqt/secured/user/me").pipe(map((user: any) => user));
  }
}



import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/Rx';


@Injectable()
export class ShareService {

  public showAlert = new BehaviorSubject({});
  showAlert$ = this.showAlert.asObservable();
  @Output() aClickedEvent = new EventEmitter<any>();

  constructor() { }

  alertPopup(data: any) {
    this.showAlert.next(data);
  }

  AClicked(msg: any) {
    this.aClickedEvent.emit(msg);
  }
}

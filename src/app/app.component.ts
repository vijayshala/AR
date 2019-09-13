import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
//Services
import { ShareService } from './services/share.service';
import { AutorenewService } from 'src/app/services/autorenew.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'autorenew';
  alertSubscripn: Subscription;
  constructor(public share: ShareService, public service: AutorenewService) { }

  //property
  header: string;
  message: string;
  show: boolean;

  onActivate() {
    window.scrollTo(0, 0)
  }

  
  ngOnInit() {
    this.alertSubscripn = this.share.showAlert$.subscribe((res: any) => {
      if (res.hasOwnProperty('options') && res.options === 'showalert') {
        this.showAlertMsg(res.msg, res.head);
      }
    });
  }

  //show popup msg
  showAlertMsg(msg, head) {
    this.message = msg;
    this.header = head;
    this.show = true;
  }

}

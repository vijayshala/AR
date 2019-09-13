import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';

//packages
import { HashLocationStrategy, LocationStrategy, DatePipe, CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//Services
import { ShareService } from './services/share.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TabsModule } from 'ngx-bootstrap';

// Modules
import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { DialogsModule } from './dialogs/dialogs.module';

// Loader
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { globalDateFormat } from '../config/date-format-config'

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    TabsModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot() ,
    BsDatepickerModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Module
    ComponentsModule,
    DialogsModule,
    ModalModule.forRoot(),
    SharedModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [LoaderService, { provide: LocationStrategy, useClass: HashLocationStrategy }, DatePipe, ShareService , globalDateFormat],
  bootstrap: [AppComponent],
  // entryComponents:[PosubmitdialogComponent,MasteroptoutdialogComponent,PopromisedialogComponent,OptoutdialogComponent,ChangepayerdialogComponent,OptindialogComponent],
  exports: [
  ]
})
export class AppModule { }

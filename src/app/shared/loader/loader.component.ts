import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  objLoaderStatus: boolean;
  constructor(private loaderService: LoaderService) {}

    ngOnInit() {

      this.objLoaderStatus = false;
      this.loaderService.loaderStatus.subscribe((val: boolean) => {
        this.objLoaderStatus = val;
      });
    }


  }


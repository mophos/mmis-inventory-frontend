import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'wm-html-preview',
  templateUrl: './html-preview.component.html',
  styleUrls: ['./html-preview.component.css']
})
export class HtmlPreviewComponent implements OnInit {

  reportURL: any;
  isShow = false;
  width = '50%';
  constructor(private santizer: DomSanitizer) { }

  ngOnInit() {
  }

  showReport(url: any, type: any = 'portrait') {
    this.width = type === 'landscape' ? this.width = '80%' : this.width = '50%';
    this.isShow = true;
    this.reportURL = this.santizer.bypassSecurityTrustResourceUrl(url);
  }
  getWidth() {
    return this.width;
  }
}

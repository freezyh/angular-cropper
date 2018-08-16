import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedataService } from './../service/sharedata.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() change = new EventEmitter<any>();
  downloadable = typeof document.createElement('a').download !== 'undefined';
  imageUrl = null;
  constructor(private sanitize: DomSanitizer, public sharedata: SharedataService) {
    // 订阅事件
    this.sharedata.infodata.subscribe(value => {
      this.imageUrl = this.sanitize.bypassSecurityTrustUrl(this.sharedata.data['url']);
    }, error => {
        console.log('error: ' + error);
    });
  }
  ngOnInit() {
    this.imageUrl = this.sanitize.bypassSecurityTrustUrl(this.sharedata.data['url']);
  }
  click(event) {
    const action = event.target.getAttribute('data-action') || event.target.parentElement.getAttribute('data-action');
      if (action) {
        this.change.emit(action);
      }
  }
  ngAfterViewInit() {
  }

}

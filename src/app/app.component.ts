import { Component, ViewChild, OnInit } from '@angular/core';
import { EditorComponent } from './editor/editor.component';
import { SharedataService } from './service/sharedata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(EditorComponent) editor: EditorComponent;

  constructor(
    public sharedata: SharedataService) {
  }

  ngOnInit(): void {

  }
  onChangeLoader(value) {
    const that = this;
    // 图片载入
    that.sharedata.data = value;
    // 下载路径要更新
    this.sharedata.handledata({});
  }
  updateChange(value) {
    const that = this;
    // 下载路径要更新
    this.sharedata.handledata({});
    // 更新editor组件，主动更新视图
    this.sharedata.data.loaded = false;
    setTimeout(() => {
      that.sharedata.data.loaded = true;
    }, 0);
  }

  navbarchange(action) {
    switch (action) {
      case 'crop':
        this.editor.crop();
        break;

      case 'clear':
        this.editor.clear();
        break;

      case 'restore':
        this.editor.restore();
        break;

      case 'remove':
        this.editor.reset();
        break;

      default:
    }
  }

}

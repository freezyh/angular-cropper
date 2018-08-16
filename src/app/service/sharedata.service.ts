import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedataService {
  /**
   * 图片组件默认的数据
   * 已裁剪
   * 裁剪中
   * 已加载
   * 图片名称
   * 撤销后的原图片路径
   * 图片类型
   * 当前图片路径
   */
  data = {
    cropped: false,
    cropping: false,
    loaded: false,
    name: '',
    previousUrl: '',
    type: '',
    url: '',
  };
  // 图片裁剪实例对象
  cropper = null;
  // 裁剪的数据
  cropdata = {
    canvasData: null,
    cropBoxData: null,
    croppedData: null
  };
  constructor() { }
  // 用来产生数据流的数据源
  private dataSource = new Subject<any>();
  // 把数据流转换成 Observable
  infodata = this.dataSource.asObservable();

  handledata(value: any) {
    // 把数据输入到数据流
    this.dataSource.next(value);
  }
}

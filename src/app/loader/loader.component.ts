import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Output() loader = new EventEmitter<any>();
  URL = window.URL || window['webkitURL'];

  constructor() { }

  ngOnInit() {
  }

  change($event) {

    this.read($event.target.files).then((data) => {
      $event.target.value = '';
      this.update(data);
    }).catch((e) => {
      $event.target.value = '';
    });
  }


  read(files) {
    return new Promise((resolve, reject) => {
      if (!files || files.length === 0) {
        resolve();
        return;
      }
      const file = files[0];

      if (/^image\/\w+$/.test(file.type)) {
        if (URL) {
          resolve({
            loaded: true,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
          });
        } else {
          reject(new Error('Your browser is not supported.'));
        }
      } else {
        reject(new Error('Please choose an image file.'));
      }
    });
  }

  update(data) {
    this.loader.emit(data);
  }

}

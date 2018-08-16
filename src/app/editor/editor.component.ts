import { Component, OnInit, OnDestroy,
   Input, Output, EventEmitter, AfterViewInit, ViewEncapsulation, ChangeDetectorRef, NgZone} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedataService } from './../service/sharedata.service';
/**
 * 必须declare
 */
declare var Cropper: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  imageUrl = null;
  onKeydown = null;
  @Output() updatecp = new EventEmitter<any>();
  constructor(private sanitize: DomSanitizer, private ref: ChangeDetectorRef, private zone: NgZone,
    public sharedata: SharedataService) {
      window.addEventListener('keydown', (this.onKeydown = this.keydown.bind(this)));
    }

  ngOnInit() {
    this.imageUrl = this.sanitize.bypassSecurityTrustUrl(this.sharedata.data.url);
  }
  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeydown);
    this.stop();
  }


  ngAfterViewInit() {
    const image = <HTMLImageElement>document.getElementById('image');
    const that = this;
    that.sharedata.cropper = new Cropper(image, {
      autoCrop: false,
      dragMode: 'move',
      background: false,
      ready: () => {

        if (that.sharedata.cropdata.croppedData && !that.sharedata.data.previousUrl) {

          that.sharedata.cropper
            .crop()
            .setData(that.sharedata.cropdata.croppedData)
            .setCanvasData(that.sharedata.cropdata.canvasData)
            .setCropBoxData(that.sharedata.cropdata.cropBoxData);

          that.sharedata.cropdata.croppedData = null;
          that.sharedata.cropdata.canvasData = null;
          that.sharedata.cropdata.cropBoxData = null;
        }
        if ( that.sharedata.data.previousUrl ) {
          that.stop();
        }
      },

      crop: ({ detail }) => {
        if (detail.width > 0 && detail.height > 0 && !this.sharedata.data['cropping']) {
          this.update({
            cropping: true,
          });
        }
      },
    });


  }

  click(event) {

    const action = event.target.getAttribute('data-action') || event.target.parentElement.getAttribute('data-action');

    switch (action) {
      case 'move':
      case 'crop':
        this.sharedata.cropper.setDragMode(action);
        break;

      case 'zoom-in':
        this.sharedata.cropper.zoom(0.1);
        break;

      case 'zoom-out':
        this.sharedata.cropper.zoom(-0.1);
        break;

      case 'rotate-left':
        this.sharedata.cropper.rotate(-90);
        break;

      case 'rotate-right':
        this.sharedata.cropper.rotate(90);
        break;

      case 'flip-horizontal':
        this.sharedata.cropper.scaleX(-this.sharedata.cropper.getData().scaleX || -1);
        break;

      case 'flip-vertical':
        this.sharedata.cropper.scaleY(-this.sharedata.cropper.getData().scaleY || -1);
        break;

      default:
    }
  }
  keydown(e) {
    switch (e.key) {
      // Undo crop
      case 'z':
        if (e.ctrlKey) {
          e.preventDefault();
          this.restore();
        }

        break;

      // Delete the image
      case 'Delete':
        this.reset();
        break;

      default:
    }


    if (!this.sharedata.cropper) {
      return;
    }

    switch (e.key) {
      // Crop the image
      case 'Enter':
        this.crop();
        break;

      // Clear crop area
      case 'Escape':
        this.clear();
        break;

      // Move to the left
      case 'ArrowLeft':
        e.preventDefault();
        this.sharedata.cropper.move(-1, 0);
        break;

      // Move to the top
      case 'ArrowUp':
        e.preventDefault();
        this.sharedata.cropper.move(0, -1);
        break;

      // Move to the right
      case 'ArrowRight':
        e.preventDefault();
        this.sharedata.cropper.move(1, 0);
        break;

      // Move to the bottom
      case 'ArrowDown':
        e.preventDefault();
        this.sharedata.cropper.move(0, 1);
        break;

      // Enter crop mode
      case 'c':
      this.sharedata.cropper.setDragMode('crop');
        break;

      // Enter move mode
      case 'm':
      this.sharedata.cropper.setDragMode('move');
        break;

      // Zoom in
      case 'i':
      this.sharedata.cropper.zoom(0.1);
        break;

      // Zoom out
      case 'o':
      this.sharedata.cropper.zoom(-0.1);
        break;

      // Rotate left
      case 'l':
      this.sharedata.cropper.rotate(-90);
        break;

      // Rotate right
      case 'r':
      this.sharedata.cropper.rotate(90);
        break;

      // Flip horizontal
      case 'h':
      this.sharedata.cropper.scaleX(-this.sharedata.cropper.getData().scaleX || -1);
        break;

      // Flip vertical
      case 'v':
      this.sharedata.cropper.scaleY(-this.sharedata.cropper.getData().scaleY || -1);
        break;

      default:
    }
  }

  stop() {
    if (this.sharedata.cropper) {
      this.sharedata.cropper.destroy();
      this.sharedata.cropper = null;
    }
  }
  crop() {
    if (this.sharedata.data.cropping) {
      this.sharedata.cropdata.croppedData = this.sharedata.cropper.getData();
      this.sharedata.cropdata.canvasData = this.sharedata.cropper.getCanvasData();
      this.sharedata.cropdata.cropBoxData = this.sharedata.cropper.getCropBoxData();


      this.sharedata.data.cropped = true;
      this.sharedata.data.cropping = false;
      this.sharedata.data.previousUrl = this.sharedata.data.url,
      this.sharedata.data.url = this.sharedata.cropper.getCroppedCanvas(this.sharedata.data.type === 'image/png' ? null : {
        fillColor: '#fff',
      }).toDataURL(this.sharedata.data.type);

      this.stop();
      this.updatecp.emit({});
    }
  }

  clear() {
    if (this.sharedata.data.cropping) {
      this.sharedata.cropper.clear();
      this.update({
        cropping: false,
      });
    }
  }

  restore() {
    if (this.sharedata.data.cropped) {
      this.sharedata.data.cropped = false;
      this.sharedata.data.url = this.sharedata.data.previousUrl;
      this.sharedata.data.previousUrl = '';
      this.updatecp.emit({});
    }
  }
  reset() {
    this.stop();
    this.sharedata.data = {
      cropped: false,
      cropping: false,
      loaded: false,
      name: '',
      previousUrl: '',
      type: '',
      url: '',
    };
    this.sharedata.cropdata = {
      canvasData: null,
      cropBoxData: null,
      croppedData: null
    };
  }

  dbClick(event) {
  }
  update(data) {
    Object.assign(this.sharedata.data, data);
  }

}

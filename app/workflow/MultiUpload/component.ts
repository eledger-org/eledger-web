import { Component, HostListener, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle } from "@angular/common";
import { RouteParams, ROUTER_DIRECTIVES } from "@angular/router-deprecated";

import { FILE_UPLOAD_DIRECTIVES, FileUploader } from "ng2-file-upload/ng2-file-upload";

import { UploadsService } from "../../Uploads/service";

import { EledgerApiService } from "../../api/eledger/service";

import {
  Button,
  DataScroller,
  Galleria,
} from "primeng/primeng";

@Component({
  selector: "Uploads",
	templateUrl: "./app/workflow/MultiUpload/component.html",
  providers: [
    EledgerApiService,
    UploadsService
  ],
  directives: [
    Button,
    CORE_DIRECTIVES,
    DataScroller,
    FILE_UPLOAD_DIRECTIVES,
    FORM_DIRECTIVES,
    Galleria,
    NgClass,
    NgStyle,
    ROUTER_DIRECTIVES
  ]
})

export class MultiUploadComponent implements OnInit {
  private fileUploader: FileUploader;

  autoPlay: boolean = false;
  transitionInterval: number = 99999999999;

  panelHeight: number;
  panelWidth: number;

  images: any[];

  disableMultiUploadDataLazyLoading: boolean;
  multiUploadData: any[];

  scrollHeight: number;

  constructor(
    private routeParams: RouteParams,
    private uploadsService: UploadsService
  ) {
  }

  ngOnInit() {
    this.images = [];

    this.multiUploadData = [];
    this.disableMultiUploadDataLazyLoading = false;

    this.panelHeight = 600;
    this.scrollHeight = 600;

    let that = this;

    setTimeout(function() {
      let dimensions = that.calculatePanelDimensions();

      that.onResize({});
    }, 1000);

    this.fileUploader = new FileUploader({
      url: this.uploadsService.getFileUploadUrl()
    });

    setInterval(function() {
      /* Check for a file every 100ms...  Wish I had events... */
      that.fileUploader.queue.forEach(function(item) {
        if (!(item.isReady || item.isUploading || item.isSuccess || item.isError)) {
          item.onComplete = (response: string, status: number, headers: any)  => {
            let resp = JSON.parse(response);

            that.images.push({
              source: resp.results[0].img
            });

            that.multiUploadData = resp.results.concat(that.multiUploadData);

            that.selectLastImage();
          }

          item.upload();
        }
      });
    }, 100);
  }

  cameraClick() {
    document.getElementById("camera-select").click();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    let dimensions = this.calculatePanelDimensions();

    this.panelHeight = dimensions.height;
    this.panelWidth = dimensions.width;
    this.scrollHeight = dimensions.scrollHeight;
  }

  editTransaction(multiUpload) {
    let url = "#";

    if (multiUpload.complexTransactionId !== undefined) {
      url = "/workflow/complex-transaction/" + multiUpload.complexTransactionId;
    }

    if (multiUpload.simpleTransactionId !== undefined) {
      url = "/workflow/simple-transaction/" + multiUpload.simpleTransactionId;
    }

    window.location.href = url;

    return url;
  }

  getUpload(multiUpload) {
    this.images.push({
      source: multiUpload.img
    });

    let that = this;

    this.selectLastImage();
  }

  onLazyLoad(event) {
    if (this.disableMultiUploadDataLazyLoading) {
      return;
    }

    this.uploadsService.getMultiUploadData(event.first, event.rows)
      .subscribe((data) => {
        if (data["length"] === 0) {
          this.disableMultiUploadDataLazyLoading = true;
        }

        this.multiUploadData = this.multiUploadData.concat(data["results"]);

        if (this.images.length === 0) {
          for (let i = 0; i < this.multiUploadData.length && i < 10; ++i) {
            this.images.push({
              source: this.multiUploadData[i].img
            });
          }
        }
      });
  }

  getPanelHeight() {
    return this.panelHeight;
  }

  calculatePanelDimensions() {
    let body = document.getElementsByTagName("body")[0];
    let filmstrip = document.getElementsByClassName("ui-galleria-filmstrip-wrapper")[0];
    let caption = document.getElementsByClassName("ui-galleria-caption")[0];
    let panelWrapper = document.getElementsByClassName("ui-galleria-panel-wrapper")[0];
    let panels = document.getElementsByClassName("ui-galleria-panel");

    let menuRow = document.getElementById("menuRow");

    let menuRowHeight = parseInt(window.getComputedStyle(menuRow, null).getPropertyValue("height"));

    let galleriaCol = document.getElementById("galleriaCol");

    //let bodyHeight = parseInt(window.getComputedStyle(body, null).getPropertyValue("height"));
    let bodyHeight = window.innerHeight;

    let filmstripHeight = parseInt(window.getComputedStyle(filmstrip, null).getPropertyValue("height"));

    let captionHeight = parseInt(window.getComputedStyle(caption, null).getPropertyValue("height"));

    return {
      height: bodyHeight - filmstripHeight - captionHeight - 58,
      width: parseInt(window.getComputedStyle(galleriaCol, null).getPropertyValue("width")),
      scrollHeight: bodyHeight - menuRowHeight - 67
    };
  }

  rotate(rot) {
    let indx = this.getSelectedImageIndex();

    if (indx !== undefined && indx !== null && indx >= 0 && indx < this.images.length) {
      let src = this.images[indx].source.replace(/[?].*/,"");

      this.uploadsService.rotate(src, rot)
      .subscribe((data) => {
        if (data["result"] === "OK") {
          this.refresh();
        }
      });
    }
  }

  getSelectedImage() {
    let galleriaPanels = document.getElementsByClassName("ui-galleria-panel");

    for (let i = 0; i < galleriaPanels.length; ++i) {
      if (!this.hasClass(galleriaPanels[i], "ui-helper-hidden")) {
        return galleriaPanels[i].getElementsByTagName("img")[0];
      }
    }
  }

  getSelectedImageIndex() {
    let selectedImg = this.getSelectedImage();

    /* See close of reduce, initialValue = null */
    return this.images.reduce(function(pre, cur, indx) {
      if (pre !== null && pre !== undefined) {
        return pre;
      }

      if (cur.source === selectedImg.getAttribute("src")) {
        return indx;
      }

      return null;
    }, null);
  }

  selectLastImage() {
    let that = this;

    setTimeout(function() {
      let galleriaFrameImages = document.getElementsByClassName("ui-galleria-frame");

      if (galleriaFrameImages.length > 0) {
        (<HTMLElement> galleriaFrameImages[galleriaFrameImages.length - 1]).click();
      }

      that.onResize({});
    }, 50);
  }

  hasClass(element, elementClass) {
    return (" " + element.className + " ").indexOf(" " + elementClass + " ") > -1;
  }

  refresh() {
    let img = this.images[this.getSelectedImageIndex()];
    let dt = (new Date()).getTime();

    for (let i = 0; i < this.multiUploadData.length; ++i) {
      if (img.source.startsWith(this.multiUploadData[i].img)) {
        if (this.multiUploadData[i].thumbnail.indexOf("?") > -1) {
          this.multiUploadData[i].thumbnail += dt
        } else {
          this.multiUploadData[i].thumbnail += "?" + dt
        }

        break;
      }
    }

    if (img.source.indexOf("?") > -1) {
      img.source += dt;
    } else {
      img.source += "?" + dt;
    }
  }
}


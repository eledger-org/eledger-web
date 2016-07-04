import { Component, HostListener, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";
import { RouteParams, ROUTER_DIRECTIVES } from "@angular/router-deprecated";

import { EledgerApiService } from "../api/eledger/service";
import { UploadsService } from "./service";

@Component({
  selector: "Uploads",
	templateUrl: "./app/Uploads/component.html",
  providers: [
    EledgerApiService,
    UploadsService
  ],
  directives: [
    CORE_DIRECTIVES,
    EledgerApiService
    /*
    DataTable,
    Button,
    Column,
    ContextMenu,
    Dialog,
    Header,
    Footer,
    MultiSelect,
    */
    ROUTER_DIRECTIVES
  ]
})

export class UploadsComponent implements OnInit {
  @Input()
  public uploads;
  public totalRecords;
  public totalRows;

  public sortField: string;
  public sortOrder: number;

  public cols: any[];
  public columnOptions: any[];

  public overlayImageSrc: string;
  public overlayHidden: boolean = true;
  public overlayHeight: number;

  public initialized: boolean;

  public gridOptions;
  public showGrid;

  public filter: any[];

  public selectedRow;
  public menuItems: any[];

  constructor(
    private uploadsService: UploadsService,
    private routeParams: RouteParams) {
  }

  ngOnInit() {
    this.filter = [
      "createdBy",
      "modifiedBy",
      "deletedBy",
      "modifiedDate",
      "deletedDate"
    ];

    this.sortField = "id";

    this.totalRows = 10;

    this.initialized = false;

    this.cols = [];
    //this.columnOptions = [];

    this.menuItems = [
      {
        label: "View",
        icon: "fa-search",
        command: (event)=>this.viewUpload(this.selectedRow)
      },
      {
        label: "Delete",
        icon: "fa-close",
        command: (event)=>this.del(this.selectedRow)
      }
    ];

    this.overlayHeight = window.innerHeight;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.overlayHeight = event.target.innerHeight;
  }

  uploadFile() {
    console.log("Not implemented");
  }

  public del(row) {
  }

  public viewUpload(row) {
    console.log(row);

    this.overlayImageSrc = row.uploadLink;
    this.overlayHidden = false;
  }

  public hideOverlay() {
    this.overlayHidden = true;
  }

  /*
  private loadLazy(event: LazyLoadEvent) {
    console.log(event);
    this.getUploads(event["first"], event["rows"], event["sortField"], event["sortOrder"]);
    this.totalRows = event["rows"];
    this.sortField = event["sortField"];
    this.sortOrder = event["sortOrder"];
  }
  */

  private getUploads(offset: number, limit: number, sortField: string, sortOrder: number): void {
    this.uploadsService
      .getUploads(offset, limit, sortField, sortOrder)
      .subscribe((data) => {
        if (this.cols.length === 0) {
          this.cols = [];
          this.columnOptions = [];

          for (let prop in data["results"][0]) {
            if (this.filter.indexOf(prop) <= -1) {
              let len = this.cols.push({
                field: prop,
                header: prop
              });

              let col = this.cols[len - 1];

              this.columnOptions.push({
                label: col.header,
                value: col
              });
            }
          }
        }

        this.totalRecords   = data["count"];
        this.uploads        = data["results"];
        console.log({
          totalRows: this.totalRows,
          totalRecords: this.totalRecords,
          uploads: this.uploads
        });

        this.initialized = true;
      });
  }
}


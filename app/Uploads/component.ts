import { Component, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";
import { RouteParams } from "@angular/router-deprecated";

import {
  Accordion,
  Button,
  Column,
  DataTable,
  Footer,
  Header,
  LazyLoadEvent,
  MenuItem
} from "primeng/primeng";

import { EledgerApiConfiguration } from "../api/eledger.api.conf";
import { UploadsService } from "./service";

@Component({
  selector: "Uploads",
	templateUrl: "./app/Uploads/component.html",
  providers: [
    EledgerApiConfiguration,
    UploadsService
  ],
  directives: [
    CORE_DIRECTIVES,
    DataTable,
    Button,
    Column,
    Header,
    Footer
  ]
})

export class UploadsComponent implements OnInit {
  @Input()
  public uploads;
  public totalRecords;
  public totalRows;

  public cols: any[];

  public gridOptions;
  public showGrid;

  public filter: any[];

  constructor(
    private uploadsService: UploadsService,
    private routeParams: RouteParams) {
  }

  ngOnInit() {
    this.filter = [
      "createdBy",
      "modifiedBy",
      "deletedBy",
      "createdDate",
      "modifiedDate",
      "deletedDate"
    ];

    this.totalRows = 10;
  }

  uploadFile() {
    console.log("Not implemented");
  }

  private loadLazy(event: LazyLoadEvent) {
    console.log(event);
    this.getUploads(event["first"], event["rows"]);
    this.totalRows = event["rows"];
  }

  private getUploads(offset: number, limit: number): void {
    this.uploadsService
      .getUploads(offset, limit)
      .subscribe((data) => {
        this.cols = [];

        for (let prop in data["results"][0]) {
          if (this.filter.indexOf(prop) <= -1) {
            this.cols.push({
              field: prop,
              header: prop
            });
          }
        }

        this.totalRecords   = data["count"];
        this.uploads        = data["results"];
        console.log({
          totalRows: this.totalRows,
          totalRecords: this.totalRecords,
          uploads: this.uploads
        });
      });
  }
}


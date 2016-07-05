import { Component, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";
import { RouteParams } from "@angular/router-deprecated";

import { LedgerEntriesService } from "./service";

import { EledgerApiService } from "../api/eledger/service";

import { LedgerEntriesDataTableComponent } from "../components/LedgerEntriesDataTable/component";

import {
  LazyLoadEvent
} from "primeng/primeng";

@Component({
  selector: "LedgerEntries",
	templateUrl: "./app/LedgerEntries/component.html",
  providers: [
    EledgerApiService,
    LedgerEntriesService
  ],
  directives: [
    CORE_DIRECTIVES,
    LedgerEntriesDataTableComponent
  ]
})

export class LedgerEntriesComponent implements OnInit {
  public ledgerEntries: any[];
  public totalRecords;
  public totalRows;

  public cols: any[];

  public gridOptions;
  public showGrid;

  public filter: any[];

  constructor(
    private ledgerEntriesService: LedgerEntriesService,
    private routeParams: RouteParams
  ) {
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

    this.getLedgerEntries(0, this.totalRows);
  }

  private loadLazy(event: LazyLoadEvent) {
    this.getLedgerEntries(event["first"], event["rows"]);
    this.totalRows = event["rows"];
  }

  private getLedgerEntries(offset: number, limit: number): void {
    this.ledgerEntriesService
      .getLedgerEntries(offset, limit)
      .subscribe((data) => {
        this.cols = [];

        for (let prop in data["results"][0]) {
          this.cols.push({
            field: prop,
            header: prop,
            enabled: !this.filter.includes(prop)
          });
        }

        this.totalRecords   = data["count"];
        this.ledgerEntries  = data["results"];

        console.log({
          totalRows: this.totalRows,
          totalRecords: this.totalRecords,
          ledgerEntries: this.ledgerEntries
        });
      });


      /*
            {
              headerName: "id",
              field: "id"
            },
            {
              headerName: "generalLedgerDate",
              field: "generalLedgerDate"
            },
            {
              headerName: "description",
              field: "description"
            },
            {
              headerName: "account",
              field: "account"
            },
            {
              headerName: "reconciled",
              field: "reconciled"
            },
            {
              headerName: "credit",
              field: "credit"
            },
            {
              headerName: "debit",
              field: "debit"
            },
            {
              headerName: "createdDate",
              field: "createdDate"
            },
            {
              headerName: "createdBy",
              field: "createdBy"
            },
            {
              headerName: "modifiedDate",
              field: "modifiedDate"
            },
            {
              headerName: "modifiedBy",
              field: "modifiedBy"
            },
            {
              headerName: "deletedDate",
              field: "deletedDate"
            },
            {
              headerName: "deletedBy",
              field: "deletedBy"
            },
          ],
          */
  }
}


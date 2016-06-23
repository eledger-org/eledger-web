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
  MenuItem
} from "primeng/primeng";

import { EledgerApiConfiguration } from "../api/eledger.api.conf";
import { LedgerEntriesService } from "../services/LedgerEntries.service";

@Component({
  selector: "LedgerEntries",
	templateUrl: "app/templates/LedgerEntries.component.html",
  providers: [
    EledgerApiConfiguration,
    LedgerEntriesService
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

export class LedgerEntriesComponent implements OnInit {
  @Input()
  public ledgerEntries;
  public cols: any[];

  public gridOptions;
  public showGrid;

  public filter: any[];

  constructor(
    private ledgerEntriesService: LedgerEntriesService,
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

    this.getLedgerEntries();
  }

  testAdd() {
    this.ledgerEntries.unshift({
      "generalLedgerDate": "Required",
      "description": "Required",
      "account": "Required",
      "reconciled": "NO"
    });
  }

  private getLedgerEntries(): void {
    this.ledgerEntriesService
      .getLedgerEntries(0, 10)
      .subscribe((data) => {
        this.cols = [];

        for (let prop in data[0]) {
          if (this.filter.indexOf(prop) <= -1) {
            console.log(prop);
            this.cols.push({
              field: prop,
              header: prop
            });
          }
        }

        /*
        this.cols.push({
          field: "deleteButton",
          header: "Delete"
        });
        */

        this.ledgerEntries = data;

        /*
        for (let ledgerEntry in this.ledgerEntries) {
          ledgerEntry.deleteButton = {
            "test": "<a href=\"#\" onclick="
          };
        }
        */
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


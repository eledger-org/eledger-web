import { Component, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";
import { RouteParams } from "@angular/router-deprecated";

import { EledgerApiConfiguration } from "../api/eledger.api.conf";
import { SimpleTransactionsService } from "./service";

@Component({
  selector: "SimpleTransactions",
	templateUrl: "./app/SimpleTransactions/component.html",
  providers: [
    EledgerApiConfiguration,
    SimpleTransactionsService
  ],
  directives: [
    CORE_DIRECTIVES
    /*
    DataTable,
    Button,
    Column,
    Header,
    Footer
    */
  ]
})

export class SimpleTransactionsComponent implements OnInit {
  @Input()
  public simpleTransactions;
  public totalRecords;
  public totalRows;

  public cols: any[];

  public gridOptions;
  public showGrid;

  public filter: any[];

  constructor(
    private simpleTransactionsService: SimpleTransactionsService,
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

  addNewSimpleTransactionButton() {
    this.simpleTransactions.unshift({
      "date": "Required",
      "description": "Required",
      "reconciled": "NO"
    });
  }

  /*
  private loadLazy(event: LazyLoadEvent) {
    console.log(event);
    this.getSimpleTransactions(event["first"], event["rows"]);
    this.totalRows = event["rows"];
  }
  */

  private getSimpleTransactions(offset: number, limit: number): void {
    this.simpleTransactionsService
      .getSimpleTransactions(offset, limit)
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

        this.totalRecords       = data["count"];
        this.simpleTransactions = data["results"];
        console.log({
          totalRows: this.totalRows,
          totalRecords: this.totalRecords,
          simpleTransactions: this.simpleTransactions
        });
      });
  }
}


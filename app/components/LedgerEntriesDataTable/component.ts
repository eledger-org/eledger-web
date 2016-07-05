import { Component, EventEmitter, Input, OnInit, Output }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";

import {
  Button,
  Column,
  DataTable,
  Footer,
  Header,
  LazyLoadEvent
} from "primeng/primeng";

@Component({
  selector: "e-ledger-entries-datatable",
	templateUrl: "./app/components/LedgerEntriesDataTable/component.html",
  providers: [],
  directives: [
    Button,
    CORE_DIRECTIVES,
    Column,
    DataTable,
    Footer,
    Header
  ]
})

export class LedgerEntriesDataTableComponent implements OnInit {
  @Input() value: any[];
  @Input() cols: any[];
  /* If you supply a defaultValues array, new entries will be initialized with these values */
  @Input() defaultValues: any[];

  @Input() totalRecords: number;
  @Input() rows: number;

  @Input() createAllowed: boolean;
  @Input() deleteAllowed: boolean;

  @Output() onLazyLoad = new EventEmitter();
  @Output() addRequested = new EventEmitter();

  constructor(
  ) {
  }

  ngOnInit() {
    this.value = [];
    this.cols = [];
    this.defaultValues = [];

    this.deleteAllowed = true;
  }

  private loadLazy(event: LazyLoadEvent) {
    this.onLazyLoad.emit(event);
    console.log(event);
  }

  private addLedgerEntry(event) {
    this.addRequested.emit(event);
  }

  private deleteLedgerEntry(ledgerEntry) {
    console.log("Delete ", ledgerEntry, " please!");
  }

  private getFieldName(field) {
    let col = this.getColByField(field);

    return (col === false ? col : col.field);
  }

  private getFieldEnabled(field) {
    let col = this.getColByField(field);

    return (col === false ? col : col.enabled);
  }

  private getFieldHeader(field) {
    let col = this.getColByField(field);

    return (col === false ? col : col.header);
  }

  private getColByField(field) {
    let subset = this.cols.filter(function(col) {
      return col.field === field;
    });

    if (subset.length !== 0) {
      return subset[0];
    } else {
      return false;
    }
  }
}


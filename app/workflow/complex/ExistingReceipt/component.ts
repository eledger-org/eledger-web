import { Component, HostListener, OnInit }  from "@angular/core";
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass } from "@angular/common";

import { AccountsService } from "../../../Accounts/service";
import { ComplexTransactionsService } from "../../../ComplexTransactions/service";
import { UploadsService } from "../../../Uploads/service";

import { EledgerApiService } from "../../../api/eledger/service";

import { SELECT_DIRECTIVES } from "ng2-select/ng2-select";

import {
  Button,
  Column,
  DataTable,
  Footer,
  Header,
  LazyLoadEvent
} from "primeng/primeng";

@Component({
  selector: "ComplexExistingReceipt",
	templateUrl: "./app/workflow/complex/ExistingReceipt/component.html",
  providers: [
    AccountsService,
    EledgerApiService,
    ComplexTransactionsService,
    UploadsService
  ],
  directives: [
    Button,
    CORE_DIRECTIVES,
    Column,
    DataTable,
    Footer,
    FORM_DIRECTIVES,
    Header,
    NgClass,
    SELECT_DIRECTIVES
  ]
})

export class ComplexExistingReceiptComponent implements OnInit {
  public complexTransactions: any[];

  public accounts: any[];
  public footerRows: any[];

  public totalRows: number;

  public unmappedUpload;
  public newTransaction;
  public uploadSrc;

  public imageHeight: number;

  constructor(
    private accountsService: AccountsService,
    private complexTransactionsService: ComplexTransactionsService,
    private uploadsService: UploadsService
  ) {
  }

  ngOnInit() {
    this.accounts = [];
    this.newTransaction = {};
    this.complexTransactions = [];

    this.getAllAccounts();
    this.getUnmappedUpload();

    this.imageHeight = window.innerHeight;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.imageHeight = event.target.innerHeight;
  }

  onSubmit() {
    try {
      let submission = {
        ledgerEntries: [],
        uploads: []
      };

      let unixDate = new Date(this.newTransaction.transactionDateText).getTime() / 1000;
      let description = this.newTransaction.description;

      this.complexTransactions.forEach(function(t) {
        let credit = parseFloat(t.credit);
        let debit = parseFloat(t.debit);

        if (isNaN(credit)) {
          credit = 0;
        }

        if (isNaN(debit)) {
          debit = 0;
        }

        submission.ledgerEntries.push({
          generalLedgerDate: unixDate,
          description: description,
          account: t.accountId,
          credit: credit * 100000,
          debit: debit * 100000
        });
      });

      submission.uploads.push({
        id: parseInt(this.newTransaction.uploadId)
      });

      console.log(submission);

      this.complexTransactionsService.postNewComplexTransaction(submission).subscribe((data) => {
        console.log(data);

        this.getUnmappedUpload();
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  private getUnmappedUpload(): void {
    this.uploadsService
      .getUnmappedUpload()
      .subscribe((data) => {
        this.unmappedUpload = data["results"][0];

        this.newTransaction.uploadId = this.unmappedUpload.id;
        this.uploadSrc = this.unmappedUpload.uploadLink;

        console.log(this.unmappedUpload.uploadLink);
      });
  }

  private getAllAccounts() {
    this.accountsService
      .getAllAccounts()
      .subscribe((data) => {
        this.accounts = data["results"].map(function(result) {
          result.text = result.fullLongAccountName;

          return result;
        });

        console.log(this.accounts[0]);
      });
  }

  private getSumOfDebits(): number {
    let sum = 0;

    this.complexTransactions.forEach(function(c) {
      let debit = parseFloat(c.debit);

      sum += (isNaN(debit) ? 0 : debit);
    });

    return sum;
  }

  private getSumOfCredits(): number {
    let sum = 0;

    this.complexTransactions.forEach(function(c) {
      let credit = parseFloat(c.credit);

      sum += (isNaN(credit) ? 0 : credit);
    });

    return sum;
  }

  private buildSummary() {
    let cr: number = this.getSumOfCredits();
    let dr: number = this.getSumOfDebits();

    this.footerRows = [
      {
        columns: [
          {footer: "Totals", colspan: 2},
          {footer: "Cr-Dr {$" + (cr - dr).toString() + "}"},
          {footer: "$" + cr},
          {footer: "$" + dr}
        ]
      }
    ];
  }

  private onEditComplete(event) {
    this.buildSummary();
  }

  private add() {
    this.complexTransactions.push({
      "num": this.complexTransactions.length + 1
    });
  }

  private del(rowData) {
    let num = 1;
    this.complexTransactions = this.complexTransactions.filter(function(row) {
      return row.num !== rowData.num;
    }).map(function(row) {
      row.num = num;
      ++num;

      return row;
    });

    this.buildSummary();
  }

  private onChange(rowData, event) {
    this.complexTransactions[rowData.num - 1].accountId = parseInt(event);
  }
}


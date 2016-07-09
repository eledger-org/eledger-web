import { Component, HostListener, OnInit }  from "@angular/core";
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass } from "@angular/common";

import { AccountsService } from "../../../Accounts/service";
import { ComplexTransactionsService } from "../../../ComplexTransactions/service";
import { TransactionsService } from "../../../Transactions/service";
import { UIConfigurationsService } from "../../../UIConfigurations/service";
import { UploadsService } from "../../../Uploads/service";

import { EledgerApiService } from "../../../api/eledger/service";

import { SELECT_DIRECTIVES } from "ng2-select/ng2-select";

import {
  AutoComplete,
  Button,
  Column,
  DataTable,
  Fieldset,
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
    TransactionsService,
    UIConfigurationsService,
    UploadsService
  ],
  directives: [
    AutoComplete,
    Button,
    CORE_DIRECTIVES,
    Column,
    DataTable,
    Fieldset,
    Footer,
    FORM_DIRECTIVES,
    Header,
    NgClass,
    SELECT_DIRECTIVES
  ]
})

export class ComplexExistingReceiptComponent implements OnInit {
  public initialLedgerEntriesCount: number = 2;

  public complexTransactions: any[];

  public accounts: any[];

  public footerRows: any[];

  public totalRows: number;

  public unmappedUpload;
  public newTransaction;
  public uploadSrc;

  public disableHeightChanges: boolean;
  public imageHeightSaved: number;

  public metadataRows: any[];

  public metadataSuggestions: any[];
  public filteredMetadataSuggestions: any[];

  constructor(
    private accountsService: AccountsService,
    private complexTransactionsService: ComplexTransactionsService,
    private transactionsService: TransactionsService,
    private uiConfigurationsService: UIConfigurationsService,
    private uploadsService: UploadsService
  ) {
  }

  ngOnInit() {
    this.filteredMetadataSuggestions = [];
    this.metadataSuggestions = [];

    this.accounts = [];
    this.newTransaction = {
      metadata: {}
    };
    this.complexTransactions = [];

    this.getMetadataRows();
    this.getAllAccounts();
    this.getUnmappedUpload();

    for (let i = 0; i < this.initialLedgerEntriesCount; ++i) {
      this.add();
    }
  }

  getMetadataRows() {
    this.metadataRows = [];

    this.uiConfigurationsService
      .getUIConfigurations("ComplexReceiptMetadata")
      .subscribe((data) => {
        this.metadataRows = JSON.parse(data["results"][0].uiConfiguration);

        this.getMetadataSuggestions();
      });
  }

  getMetadataSuggestions() {
    let suggestionsToFetch = [];
    let fields;

    for (let i = 0; i < this.metadataRows.length; ++i) {
      fields = this.metadataRows[i].fields;

      for (let j = 0; j < fields.length; ++j) {
        if (!fields[j].invisible && fields[j].type === "autoComplete") {
          suggestionsToFetch.push({
            name: fields[j].name,
            count: fields[j].suggestionCount || 10
          });
        }
      }
    }

    this.transactionsService.getSuggestions(suggestionsToFetch)
      .subscribe((data) => {
        this.metadataSuggestions = data;
      });
  }

  filterAnyVisible(metadataRows) {
    if (metadataRows === undefined || metadataRows.length <= 0) {
      return [];
    }

    return metadataRows.filter(function(row) {
      return row.fields.reduce(function(pre, cur) {
        if (pre.invisible) {
          return !cur.invisible;
        } else {
          return true;
        }
      });
    });
  }

  getImageHeight() {
    let slf = this;

    if (slf.disableHeightChanges) {
      return slf.imageHeightSaved;
    }

    if (document !== undefined) {
      let body = document.getElementsByTagName("body");

      if (body !== undefined && body.length >= 1) {
        slf.imageHeightSaved =
          parseInt(window.getComputedStyle(body[0], null).getPropertyValue("height"));

        setTimeout(function() {
          slf.disableHeightChanges = false;
        }, 500);
      }
    } else {
      setTimeout(function() {
        slf.disableHeightChanges = false;
      }, 500);

      slf.imageHeightSaved = 300;
    }

    slf.disableHeightChanges = true;

    return slf.imageHeightSaved;
  }

  onSubmit() {
    try {
      let submission = {
        ledgerEntries: [],
        metadata: this.newTransaction.metadata,
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
          account: t.selectedAccount.id,
          credit: credit * 100000,
          debit: debit * 100000
        });
      });

      submission.uploads.push({
        id: parseInt(this.newTransaction.uploadId)
      });

      this.complexTransactionsService
        .postNewComplexTransaction(submission)
        .subscribe((data) => {
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
  }

  private filterMetadataSuggestions(mdFieldName, event) {
    if (this.metadataSuggestions === undefined) {
      return [];
    }

    if (this.metadataSuggestions[mdFieldName] === undefined) {
      this.filteredMetadataSuggestions[mdFieldName] = [];

      return [];
    }

    this.filteredMetadataSuggestions[mdFieldName] =
      this.metadataSuggestions[mdFieldName].filter(function(md) {
        return md[mdFieldName].toLowerCase().indexOf(event.query.toLowerCase()) >= 0;
      }).map(function(md) {
        return md[mdFieldName];
      });

    return this.filteredMetadataSuggestions[mdFieldName];
  }

  private search(ledgerEntry, event) {
    ledgerEntry.suggestedAccounts = [];

    ledgerEntry.suggestedAccounts = this.accounts.filter(function(account) {
      return account.text.toLowerCase().indexOf(event.query.toLowerCase()) >= 0;
    });

    return ledgerEntry.suggestedAccounts;
  }
}


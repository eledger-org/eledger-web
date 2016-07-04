import { Component, HostListener, OnInit }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";

import { AccountsService } from "../../Accounts/service";
import { SimpleTransactionsService } from "../../SimpleTransactions/service";
import { UploadsService } from "../../Uploads/service";

import { EledgerApiService } from "../../api/eledger/service";

import { AccountSelectorComponent } from "../../components/AccountSelector/component";

@Component({
  selector: "ExistingReceipt",
	templateUrl: "./app/workflow/ExistingReceipt/component.html",
  providers: [
    AccountsService,
    EledgerApiService,
    SimpleTransactionsService,
    UploadsService
  ],
  directives: [
    AccountSelectorComponent,
    CORE_DIRECTIVES
  ]
})

export class ExistingReceiptComponent implements OnInit {
  public accounts: any[];
  public unmappedUpload;
  public newReceipt;
  public uploadSrc;

  public imageHeight: number;

  constructor(
    private accountsService: AccountsService,
    private simpleTransactionsService: SimpleTransactionsService,
    private uploadsService: UploadsService
  ) {
  }

  ngOnInit() {
    this.accounts = [];
    this.newReceipt = {};

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
      this.newReceipt.uploadId = parseInt(this.newReceipt.uploadId);
      this.newReceipt.exchange = parseFloat(this.newReceipt.exchangeAmount) * 100000;
      this.newReceipt.transactionDate = new Date(this.newReceipt.transactionDateText).getTime() / 1000;

      this.simpleTransactionsService.postNewSimpleTransaction(this.newReceipt).subscribe((data) => {
        console.log(data);

        this.getUnmappedUpload();
        this.newReceipt.exchange = 0;
        this.newReceipt.description = "";
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  private toAccountUpdated(event) {
    if (event === undefined || event === null) return;
    this.newReceipt.originEntry = event.id;
  }

  private fromAccountUpdated(event) {
    if (event === undefined || event === null) return;
    this.newReceipt.destinEntry = event.id;
  }

  private getUnmappedUpload(): void {
    this.uploadsService
      .getUnmappedUpload()
      .subscribe((data) => {
        this.unmappedUpload = data["results"][0];

        this.newReceipt.uploadId = this.unmappedUpload.id;
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
      });
  }
}


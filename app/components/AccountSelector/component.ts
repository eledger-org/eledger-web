import { Component, EventEmitter, Input, OnInit, Output }  from "@angular/core";
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass } from '@angular/common';

import { AccountsService } from "../../Accounts/service";

import { SELECT_DIRECTIVES } from "ng2-select/ng2-select";

@Component({
  selector: "e-accountSelector",
	templateUrl: "./app/components/AccountSelector/component.html",
  providers: [
    AccountsService
  ],
  directives: [
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    NgClass,
    SELECT_DIRECTIVES
  ]
})

export class AccountSelectorComponent implements OnInit {
  @Input()  accounts: any[]
  @Input()  label: string;
  @Input()  name: string;
  @Output() accountUpdated = new EventEmitter();

  public selectedAccount;

  constructor(
    private accountsService: AccountsService
  ) {}

  ngOnInit() {
    this.accounts = [];
  }

  data(event) {
    if (event === undefined || event.id === undefined) {
      this.selectedAccount = null;

      this.accountUpdated.emit(this.selectedAccount);
    }
  }

  selected(event) {
    this.selectedAccount = this.accounts.filter(function(item) {
      return item.id === event.id;
    })[0];

    this.accountUpdated.emit(this.selectedAccount);
  }

  removed(event) {
  }

  typed(event) {
    console.log(event);
  }

  updateAccounts() {
    this.accounts = this.accounts.map(function(result) {
      result.text = result.fullLongAccountName;

      return result;
    });
  };
}


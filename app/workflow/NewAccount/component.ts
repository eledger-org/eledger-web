import { Component, OnInit }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";

import { AccountsService } from "../../Accounts/service";

import { AccountSelectorComponent } from "../../components/AccountSelector/component";
import { EledgerApiService } from "../../api/eledger/service";

@Component({
  selector: "NewAccount",
	templateUrl: "./app/workflow/NewAccount/component.html",
  providers: [
    AccountsService,
    EledgerApiService
  ],
  directives: [
    AccountSelectorComponent,
    CORE_DIRECTIVES
  ]
})

export class NewAccountComponent implements OnInit {
  public newAccount;
  public accounts: any[];

  constructor(
    private accountsService: AccountsService
  ) {
  }

  ngOnInit() {
    this.newAccount = {};
    this.getAllAccounts();
  }

  onSubmit() {
    try {
      this.accountsService.postNewAccount(this.newAccount).subscribe((data) => {
        this.getAllAccounts();
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  private parentAccountUpdated(event) {
    if (event !== null) {
      this.newAccount.parentAccount = event.id;
    } else {
      delete this.newAccount.parentAccount;
    }
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


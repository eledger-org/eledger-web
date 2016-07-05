import { Component, OnInit }  from "@angular/core";
import { RouteConfig, ROUTER_DIRECTIVES } from "@angular/router-deprecated";

import { NewAccountComponent }          from "./workflow/NewAccount/component";
import { DatabaseVersionComponent }     from "./DatabaseVersion/component";
import { ExistingReceiptComponent }     from "./workflow/ExistingReceipt/component";
import { LedgerEntriesComponent }       from "./LedgerEntries/component";
import { SimpleTransactionsComponent }  from "./SimpleTransactions/component";
import { UploadsComponent }             from "./Uploads/component";

/* Complex components */
import { ComplexExistingReceiptComponent } from "./workflow/complex/ExistingReceipt/component";

@Component({
  selector: "my-app",
  templateUrl: "app/app.component.html",
	styleUrls: ["app/app.component.css"],
  directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  {
    path: "/database-version",
    name: "Database Version",
    component: DatabaseVersionComponent
  },
  {
    path: "/existing-receipt",
    name: "Existing Receipt",
    component: ExistingReceiptComponent
  },
  {
    path: "/new-account",
    name: "New Account",
    component: NewAccountComponent
  },
  {
    path: "/ledger-entries",
    name: "Ledger Entries",
    component: LedgerEntriesComponent
  },
  {
    path: "/simple-transactions",
    name: "Simple Transactions",
    component: SimpleTransactionsComponent
  },
  {
    path: "/uploads",
    name: "Uploads",
    component: UploadsComponent
  },
  {
    path: "/workflow/complex/existing-receipt",
    name: "Complex Existing Receipt",
    component: ComplexExistingReceiptComponent
  }
])

export class AppComponent {
  title = "Eledger";
};

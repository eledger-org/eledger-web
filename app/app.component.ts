import { Component, OnInit }  from "@angular/core";
import { RouteConfig, ROUTER_DIRECTIVES } from "@angular/router-deprecated";

import { InputText } from "primeng/primeng";

import { DatabaseVersionComponent }     from "./DatabaseVersion/component";
import { LedgerEntriesComponent }       from "./LedgerEntries/component";
import { SimpleTransactionsComponent }  from "./SimpleTransactions/component";
import { UploadsComponent }             from "./Uploads/component";

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
    path: "/uploads",
    name: "Uploads",
    component: UploadsComponent
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
  }
])

export class AppComponent {
  title = "Eledger";
};

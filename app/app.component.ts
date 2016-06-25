import { Component, OnInit }  from "@angular/core";
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "@angular/router-deprecated";
import { HTTP_PROVIDERS } from "@angular/http";

import { InputText } from "primeng/primeng";

import { DatabaseVersionComponent } from "./DatabaseVersion/component";
import { DatabaseVersionService } from "./DatabaseVersion/service";

import { LedgerEntriesComponent } from "./LedgerEntries/component";

@Component({
  selector: "my-app",
  templateUrl: "app/app.component.html",
	styleUrls: ["app/app.component.css"],
	directives: [ROUTER_DIRECTIVES],
	providers: [
    HTTP_PROVIDERS,
		ROUTER_PROVIDERS,
    DatabaseVersionService
	]
})

@RouteConfig([
  {
    path: "/database-version",
    name: "Database Version",
    component: DatabaseVersionComponent,
    useAsDefault: true
  },
  {
    path: "/ledger-entries",
    name: "Ledger Entries",
    component: LedgerEntriesComponent
  }
])

export class AppComponent {
  title = "Eledger";
};

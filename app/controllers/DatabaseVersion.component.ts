import { Component, OnInit, Input }  from "@angular/core";
import { CORE_DIRECTIVES } from "@angular/common";
import { RouteParams } from "@angular/router-deprecated";

import { DatabaseVersionService } from "../services/DatabaseVersion.service";
import { EledgerApiConfiguration } from "../api/eledger.api.conf";

@Component({
  selector: "DatabaseVersion",
	templateUrl: "app/templates/DatabaseVersion.component.html",
  providers: [
    EledgerApiConfiguration,
    DatabaseVersionService
  ],
  directives: [CORE_DIRECTIVES ]
})

export class DatabaseVersionComponent implements OnInit {
  @Input()
  public databaseVersion;

  constructor(
    private databaseVersionService: DatabaseVersionService,
    private routeParams: RouteParams) {
  }

  ngOnInit() {
    this.getVersion();
  }

  private getVersion(): void {
    console.log("Hi!");
    this.databaseVersionService
      .getById(0)
      .subscribe((data) => this.databaseVersion = data,
                 error => console.error(error),
                 () => console.log(this.databaseVersion));
  }
}

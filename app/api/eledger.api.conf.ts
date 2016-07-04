import { Injectable } from "@angular/core";

@Injectable()
export class EledgerApiConfiguration {
  /* TODO: Make this configurable */
  public ApiUrl: string;

  constructor()
  {
    let config = require("config");

    if (config.has("apiurl")) {
      this.ApiUrl = config.get("apiurl");
    }
  }
}

import { Inject, Injectable }  from "@angular/core";
import { Http, Response } from "@angular/http";

import "rxjs/add/operator/map";

import { Observable } from "rxjs/Observable";

export class EledgerApiConfig {
  apiUrl: string;
  apiToken: string;
}

@Injectable()
export class EledgerApiService {
  /* TODO: Make this configurable */
  constructor(
    @Inject("eledger.api.config") private eledgerApiConfig: EledgerApiConfig
  ) {
  }

  getApiUrl() {
    return this.eledgerApiConfig.apiUrl;
  }
}

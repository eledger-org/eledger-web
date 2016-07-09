import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiService } from "../api/eledger/service";

@Injectable()
export class TransactionsService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiService) {
    this.actionUrl = _configuration.getApiUrl() + "transactions/suggestions";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getSuggestions(requestedSuggestions) {
    let params: URLSearchParams = new URLSearchParams();

    params.set("requestedSuggestions", JSON.stringify(requestedSuggestions));

    return this._http
      .get(this.actionUrl, {
        search: params
      })
      .map(res => res.json());
  }
}


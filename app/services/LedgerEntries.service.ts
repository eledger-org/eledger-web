import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiConfiguration } from "../api/eledger.api.conf";

@Injectable()
export class LedgerEntriesService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiConfiguration) {
    this.actionUrl = _configuration.ApiUrl + "ledger-entries/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getLedgerEntries =  (offset: number, limit: number): Observable<Response> => {
    let params: URLSearchParams = new URLSearchParams();
    if (offset !== undefined) {
      params.set("offset", "" + offset);
    }

    if (limit !== undefined) {
      params.set("limit", "" + limit);
    }

    return this._http
      .get(this.actionUrl, {
        search: params
      })
      .map(res => res.json());
  }

  public getById = (id: number): Observable<Response> => {
    console.log(this.actionUrl);
    return this._http.get(this.actionUrl).map(res => res.json());
  }
}

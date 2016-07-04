import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiService } from "../api/eledger/service";

@Injectable()
export class SimpleTransactionsService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiService) {
    this.actionUrl = _configuration.getApiUrl() + "simple-transactions/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getSimpleTransactions =  (offset: number, limit: number): Observable<Response> => {
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

  public postNewSimpleTransaction = (newSimpleTransaction): Observable<Response> => {
    let body = JSON.stringify({length: 1, results: [newSimpleTransaction]});

    let options = new RequestOptions({
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    return this._http
      .post(this.actionUrl, body, options)
      .map(res => res.json());
  }
}

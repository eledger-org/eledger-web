import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiService } from "../api/eledger/service";

@Injectable()
export class AccountsService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiService) {
    this.actionUrl = _configuration.getApiUrl() + "accounts/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getAllAccounts = (): Observable<Response> => {
    return this.getAccounts(undefined, undefined);
  }

  public getAccounts =  (offset: number, limit: number): Observable<Response> => {
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
    return this._http.get(this.actionUrl).map(res => res.json());
  }

  public postNewAccount = (newAccount): Observable<Response> => {
    let body = JSON.stringify({length: 1, results: [newAccount]});

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


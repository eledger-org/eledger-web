import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiConfiguration } from "../api/eledger.api.conf";

@Injectable()
export class DatabaseVersionService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiConfiguration) {
    this.actionUrl = _configuration.ApiUrl + "database-version/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getById = (id: number): Observable<Response> => {
    console.log(this.actionUrl);
    return this._http.get(this.actionUrl).map(res => res.json());
  }
}

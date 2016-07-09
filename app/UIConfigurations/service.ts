import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiService } from "../api/eledger/service";

@Injectable()
export class UIConfigurationsService {
  private actionUrl: string;
  private headers: Headers;

  constructor(
    private _http: Http,
    private _configuration: EledgerApiService
  ) {
    this.actionUrl = _configuration.getApiUrl() + "ui-configurations/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getUIConfigurations =  (type_name: string): Observable<Response> => {
    let url = this.actionUrl + type_name;

    return this._http
      .get(url)
      .map(res => res.json());
  }
}


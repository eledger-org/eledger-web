import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
import { EledgerApiService } from "../api/eledger/service";

@Injectable()
export class UploadsService {
  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http, private _configuration: EledgerApiService) {
    this.actionUrl = _configuration.getApiUrl() + "uploads/";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Accept", "application/json");
  }

  public getFileUploadUrl = () => {
    return this.actionUrl + "new-upload";
  }

  public getUploads =  (offset: number, limit: number, sortField: string, sortOrder: number): Observable<Response> => {
    let params: URLSearchParams = new URLSearchParams();
    if (offset !== undefined) {
      params.set("offset", "" + offset);
    }

    if (limit !== undefined) {
      params.set("limit", "" + limit);
    }

    if (sortField !== undefined) {
      params.set("sortField", "" + sortField);
    }

    if (sortOrder !== undefined) {
      params.set("sortOrder", "" + sortOrder);
    }

    return this._http
      .get(this.actionUrl, {
        search: params
      })
      .map(this.transformResponseToHuman);
  }

  public getMultiUploadData = (offset: number, limit: number): Observable<Response> => {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.actionUrl + "multi-upload-data";

    if (offset !== undefined) {
      params.set("offset", "" + offset);
    }

    if (limit !== undefined) {
      params.set("limit", "" + limit);
    }

    return this._http
      .get(url, {
        search: params
      }).map(res => res.json());
  }

  public getUnmappedUpload = (): Observable<Response> => {
    let url = this.actionUrl + "unmapped";

    return this._http
      .get(url).map(this.transformResponseToHuman);
  }

  public getById = (id: number): Observable<Response> => {
    return this._http.get(this.actionUrl).map(this.transformResponseToHuman);
  }

  public rotate = (img: string, rot: number): Observable<Response> => {
    let params: URLSearchParams = new URLSearchParams();
    let url = this.actionUrl + "rotate-file";

    params.set("imageTarget", img);
    params.set("rotateDegrees", "" + rot);

    return this._http
      .get(url, {search: params}).map(res => res.json());
  }

  public transformResponseToHuman(res) {
    let res2 = res.json();

    res2.results = res2.results.map(function(result) {
      result.createdDate = UploadsService.dateOnlyFormat(new Date(result.createdDate * 1000));

      return result;
    });

    return res2;
  }

  /* TODO move this somewhere reusable */
  public static dateOnlyFormat(date: Date) {
    return date.getFullYear() + "/" +
      (date.getMonth() <= 8 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "/" +
      (date.getDate() <= 9 ? "0" + date.getDate() : date.getDate());
  }
}


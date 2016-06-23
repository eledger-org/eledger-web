import { Injectable } from "@angular/core";

@Injectable()
export class EledgerApiConfiguration {
  /* TODO: Make this configurable */
  public ApiUrl: string = "/api/";
}

import { XHRBackend }                           from "@angular/http";

import { bootstrap }                            from "@angular/platform-browser-dynamic";
import { provide, ComponentRef }                from "@angular/core";
import { HTTP_PROVIDERS }                       from "@angular/http";
import { ROUTER_PROVIDERS }                     from "@angular/router-deprecated";

import { AppComponent }                         from "./app.component";

import {
  APP_BASE_HREF,
  LocationStrategy,
  HashLocationStrategy
} from '@angular/common'

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS
])
.then((appRef: ComponentRef<any>) => {
  console.log("bootstrapped");
})
.catch(err => console.error(err));


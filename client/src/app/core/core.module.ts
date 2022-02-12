import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {appInitializer} from "./helpers/app-initializer";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {ErrorInterceptor} from "./interceptors/errors.interceptor";

import {AuthService} from "../pages/auth/services/auth.service";

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        {provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService]},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ]
})
export class CoreModule {
}

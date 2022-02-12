import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private apiUrl = environment.apiUrl;
    private options = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    };

    constructor(
        private httpClient: HttpClient
    ) {
    }

    public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.httpClient
            .get(this.apiUrl + path, {params})
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public put(path: string, body: object = {}): Observable<any> {
        return this.httpClient
            .put(this.apiUrl + path, JSON.stringify(body), this.options)
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public post(path: string, body: object = {}, options: object = {}): Observable<any> {
        this.options = {...this.options, ...options};

        return this.httpClient
            .post(this.apiUrl + path, JSON.stringify(body), {...this.options})
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public delete(path: string): Observable<any> {
        return this.httpClient
            .delete(this.apiUrl + path)
            .pipe(
                catchError(this.formatErrors)
            );
    }

    public formatErrors(error: any): Observable<any> {
        return throwError(error.error);
    }
}

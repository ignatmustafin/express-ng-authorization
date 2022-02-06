import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentTokenValueSubject !: BehaviorSubject<any>;

    constructor(
        private http: HttpClient
    ) {
        this.currentTokenValueSubject = new BehaviorSubject<any>(
            JSON.parse(<string>localStorage.getItem('auth_token'))
        );
    }

    getCurrentUserSubject(): Observable<string> {
        return this.currentTokenValueSubject.asObservable();
    }

    getCurrentUserTokenValue(): string {
        return this.currentTokenValueSubject.value;
    }
}

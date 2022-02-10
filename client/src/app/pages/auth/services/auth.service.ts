import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../../../shared/models/user.model";
import {RestService} from "../../../core/services/rest.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(
        private http: RestService,
    ) {
        this.currentUserSubject = new BehaviorSubject(JSON.parse(<string>localStorage.getItem('quiz.user')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    doRegistration(user: any) {
        return this.http.post(`/api/auth/registration`, {user});
    }

    doSignIn(email: string, password: string): Observable<any> {
        return this.http.post(`/auth/signIn`, {email, password})
            .pipe(
                map(response => {
                    this.currentUserSubject.next(response.data);
                    this.startRefreshTokenTimer();
                    return response;
                })
            );
    }

    doSignInWithGoogle(code: string): Observable<any> {
        return this.http.post('/auth/signInWithGoogle', {code})
            .pipe(
                map(response => {
                    this.currentUserSubject.next(response.data);
                    this.startRefreshTokenTimer();
                    return response;
                })
            );
    }

    doSignInWithFacebook(code: string): Observable<any> {
        return this.http.post('/auth/signInWithFacebook', {code})
            .pipe(
                map(response => {
                    this.currentUserSubject.next(response.data);
                    this.startRefreshTokenTimer();
                    return response;
                })
            );
    }

    doSignOut(): void {
        this.stopRefreshTokenTimer();
        this.currentUserSubject.next(null);
    }

    refreshToken() {
        return this.http.post('/auth/refreshToken', {}, {withCredentials: true})
            .pipe(
                map(response => {
                    this.currentUserSubject.next(response.data);
                    this.startRefreshTokenTimer();
                    return response;
                })
            )
    }

    private refreshTokenTimeout: any;

    private startRefreshTokenTimer() {
        const jwtToken = JSON.parse(atob(this.currentUserValue!.accessToken.split('.')[1]));
        console.log(jwtToken)
        const expires = new Date(jwtToken.exp * 1000);
        console.log(expires)
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}

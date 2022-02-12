import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from "../../../shared/models/user.model";
import {RestService} from "../../../core/services/rest.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private refreshTokenTimeout!: number;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(
        private http: RestService,
    ) {
        this.currentUserSubject = new BehaviorSubject(JSON.parse(<string>localStorage.getItem('quiz.user')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    doRegistration(user: any): Observable<any> {
        return this.http.post(`/auth/registration`, {...user});
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

    doSignOut(): Observable<any> {
        return this.http.post('/auth/signOut', {}, {withCredentials: true})
            .pipe(
                map(response => {
                    this.stopRefreshTokenTimer();
                    this.currentUserSubject.next(null);
                    return response;
                })
            );
    }

    getResetPasswordLink(email: string) : Observable<any> {
        return this.http.post('/auth/getResetLink', {email: email});
    }

    doResetPassword(code: string): Observable<any> {
        return this.http.post('/auth/resetPassword', {code: code});
    }

    refreshToken() {
        return this.http.post('/auth/refreshToken', {}, {withCredentials: true})
            .pipe(
                map(response => {
                    this.currentUserSubject.next(response.data);
                    this.startRefreshTokenTimer();
                    return response;
                })
            );
    }

    private startRefreshTokenTimer() {
        const accessToken = JSON.parse(atob(this.currentUserValue!.accessToken.split('.')[1]));
        const expires = new Date(accessToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}

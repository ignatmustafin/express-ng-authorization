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

    doSignIn(email: string, password: string) {
        return this.http.post(`/auth/signIn`, {email, password})
            .pipe(
                map(response => {
                    localStorage.setItem('quiz.user', JSON.stringify(response.data));
                    this.currentUserSubject.next(response.data);

                    return response;
                })
            );
    }

    doSignOut(): void {
        localStorage.removeItem('quiz.user');
        this.currentUserSubject.next(null);
    }
}

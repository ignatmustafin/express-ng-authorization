import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import * as queryString from 'query-string';
import {environment} from "../../../../../environments/environment";

import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public form !: FormGroup;
    public errorWithSignIn: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['vitaliy@test.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required, Validators.minLength(6)]]
        });

        if (this.auth.currentUserValue) {
            this.router.navigate(['/study-sets']);
        }

        this.getInfoAboutUrl();
    }

    private getInfoAboutUrl() {
        const urlParams = queryString.parse(window.location.search);

        if (Object.keys(urlParams).length) {
            const code = <string>urlParams['code'];

            if (urlParams['scope']) {
                this.doSignInWithGoogle(code);
            } else {
                this.doSignInWithFacebook(code);
            }
        }
    }

    signIn(): void {
        if (this.form.valid) {
            const email = this.form.controls['email'].value;
            const password = this.form.controls['password'].value;

            this.auth.doSignIn(email, password).subscribe({
                next : () => {
                    localStorage.setItem('confirm', JSON.stringify(true));
                    this.router.navigate(['/study-sets']);
                },
                error: error => {
                    this.errorWithSignIn = error.message;
                }
            });
        }
    }

    doSignInWithGoogle(code: string): void {
        this.auth.doSignInWithGoogle(code).subscribe({
            next: () => {
                localStorage.setItem('confirm', JSON.stringify(true));
                this.router.navigate(['/study-sets']);
            },
            error: error => {
                console.log(error);
            }
        });
    }

    doSignInWithFacebook(code: string): void {
        this.auth.doSignInWithFacebook(code).subscribe({
            next: () => {
                localStorage.setItem('confirm', JSON.stringify(true));
                this.router.navigate(['/study-sets']);
            },
            error: error => {
                console.log(error);
            }
        });
    }

    getGoogleLink(): void {
        const stringParamsForGoogle = queryString.stringify({
            client_id: environment.google.google_client_id,
            redirect_uri: environment.google.google_redirect_url,
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ].join(' '),
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
        });

        const link = document.createElement('a');
        link.href = `${environment.google.google_auth_url}?${stringParamsForGoogle}`;
        link.click();
    }

    getFacebookLink(): void {
        const stringParamsForFacebook = queryString.stringify({
            client_id: environment.facebook.facebook_client_id,
            redirect_uri: environment.facebook.facebook_redirect_url,
            scope: ['email', 'user_friends'].join(','),
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup',
        });

        const link = document.createElement('a');
        link.href = `${environment.facebook.facebook_auth_url}?${stringParamsForFacebook}`;
        link.click();
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    };

    checkChange(control: string) {
        const field = this.form.controls[control];

        if (!field.value) {
            field.markAsUntouched();
        }
    }
}

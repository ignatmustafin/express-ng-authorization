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

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['vitaliyhappy94@gmail.com', [Validators.required, Validators.email]],
            password: ['123456', [Validators.required, Validators.minLength(6)]]
        });

        if (this.auth.currentUserValue) {
            this.router.navigate(['/study-sets']);
        }

        this.getInfoAboutUrl();
    }

    private getInfoAboutUrl() {
        const urlParams = queryString.parse(window.location.search);

        console.log(urlParams)
        if (Object.keys(urlParams).length) {
            const code = <string>urlParams['code'];
            this.doSignInWithGoogle(code);
        }
    }

    signIn(): void {
        if (this.form.valid) {
            const email = this.form.controls['email'].value;
            const password = this.form.controls['password'].value;

            this.auth.doSignIn(email, password).subscribe({
                error: error => {
                    console.log(error)
                },
                complete: () => {
                    this.router.navigate(['/study-sets']);
                }
            });
        }
    }

    doSignInWithGoogle(code: string): void {
        this.auth.doSignInWithGoogle(code).subscribe({
            next: response => {

            },
            error: error => {
                this.router.navigate(['/study-sets']);
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

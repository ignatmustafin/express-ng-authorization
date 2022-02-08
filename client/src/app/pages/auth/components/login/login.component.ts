import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from '../../services/auth.service';
import * as queryString from 'query-string';
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
            console.log(urlParams['code']);
            console.log(urlParams['error']);
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
            client_id: '380404882965-44k7u4koidempquu0n30emtd266hk5qd.apps.googleusercontent.com',
            redirect_uri: 'http://localhost:4200/auth/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ].join(' '),
            response_type: 'code',
            access_type: 'offline',
            prompt: 'consent',
        });

        const link = document.createElement('a');
        link.href = `https://accounts.google.com/o/oauth2/v2/auth?${stringParamsForGoogle}`;
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

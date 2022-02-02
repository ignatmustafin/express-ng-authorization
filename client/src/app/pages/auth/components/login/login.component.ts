import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public form !: FormGroup;

    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.min(6), Validators.max(10)])
        });
    }

    submit() {
        this.http.post('http://localhost:3000/api/auth/signIn', {}).subscribe({
            next: response => {

            },
            error: error => {
                console.log(error)
            }
        })
    }
}

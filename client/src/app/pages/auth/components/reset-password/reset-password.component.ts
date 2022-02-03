import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    public form !: FormGroup;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit() {
        if (this.form.valid) {
            const body = {
                email: this.form.controls['email'].value,
                password: this.form.controls['password'].value
            }

            this.http.post('http://localhost:3000/api/auth/signIn', body).subscribe({
                next: response => {
                    console.log(response)
                },
                error: error => {
                    console.log(error)
                }
            });
        }
    }

    public errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    public checkChange(control: string) {
        const field = this.form.controls[control];

        if (!field.value) {
            field.markAsUntouched();
        }
    }
}

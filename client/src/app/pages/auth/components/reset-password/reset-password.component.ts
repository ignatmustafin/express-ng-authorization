import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    public formResetPassword !: FormGroup;
    public formSetNewPassword !: FormGroup;
    public showNewPassword: boolean = true;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.formResetPassword = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.formSetNewPassword = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        });
    }

    submitResetPassword() {
        if (this.formResetPassword.valid) {
            const body = {
                email: this.formResetPassword.controls['email'].value,
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

    submitSetNewPassword() {
        if (this.formSetNewPassword.valid) {
            const body = {
                email: this.formSetNewPassword.controls['email'].value,
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

    public errorHandling = (control: string, error: string, form: FormGroup) => {
        if (control === 'confirmPassword') {
            const password = this.formSetNewPassword.controls['confirmPassword'];
            const isValid = this.formSetNewPassword.controls['password'].value !== this.formSetNewPassword.controls['confirmPassword'].value;

            if (isValid && password.value.length) {
                password.setErrors({...password.errors, notMatch: true});
            } else {
                this.formSetNewPassword.controls[control].setErrors(null);
            }
        }

        return form.controls[control].hasError(error);
    }

    public checkChange(control: string, form: FormGroup) {
        const field = form.controls[control];

        if (!field.value) {
            field.markAsUntouched();
        }
    }
}

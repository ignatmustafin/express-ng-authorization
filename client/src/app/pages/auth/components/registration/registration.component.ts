import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    public form !: FormGroup;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    doRegistration() {
        /*if (this.form.valid) {
            const user = {
                email: this.form.controls['email'].value,
                password: this.form.controls['password'].value,
                firstName: this.form.controls['firstName'].value,
                lastName: this.form.controls['lastName'].value,
                passwordConfirmation: this.form.controls['confirmPassword'].value
            };

            this.authService.doRegistration(user).subscribe({
                error: error => {
                    console.log(error)
                },
                complete: () => {
                    this.router.navigate(['/auth/account-verification'], {queryParams: {isVerified: false}});
                }
            });
        }*/
        this.router.navigate(['/auth/account-verification'], {queryParams: {isVerified: false}});
    }

    errorHandling = (control: string, error: string) => {
        if (control === 'confirmPassword') {
            const password = this.form.controls['confirmPassword'];
            const isValid = this.form.controls['password'].value !== this.form.controls['confirmPassword'].value;

            if (isValid && password.value.length) {
                password.setErrors({...password.errors, notMatch: true});
            } else {
                this.form.controls[control].setErrors(null);
            }
        }

        return this.form.controls[control].hasError(error);
    };

    checkChange(control: string) {
        const field = this.form.controls[control];

        if (!field.value) {
            field.markAsUntouched();
        }
    }
}

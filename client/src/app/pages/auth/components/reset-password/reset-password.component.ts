import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    public formResetPassword !: FormGroup;
    public formSetNewPassword !: FormGroup;

    public confirmedEmail: boolean = false;
    public resetPassword: boolean = false;
    public passwordWasChanged: boolean = false;

    public userEmail: string = '';
    public errorWithEmail: string = '';

    public link!: string;
    public id!: string;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe({
            next: result => {
                this.link = result['link'];
                this.id = result['id'];

                if (this.link && this.id) {
                    this.resetPassword = true;
                }
            }
        });


        this.formResetPassword = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.formSetNewPassword = this.formBuilder.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        });
    }

    getResetPasswordLink() {
        if (this.formResetPassword.valid) {
            const userEmail = this.formResetPassword.controls['email'].value;

            this.authService.getResetPasswordLink(userEmail).subscribe({
                next: () => {
                    this.userEmail = userEmail;
                    this.confirmedEmail = true;
                    this.formSetNewPassword.reset();
                },
                error: error => {
                    this.errorWithEmail = error.message;
                }
            });
        }
    }

    setNewPassword() {
        if (this.formSetNewPassword.valid) {
            const newPassword = this.formSetNewPassword.controls['password'].value;
            const confirmPassword = this.formSetNewPassword.controls['confirmPassword'].value;

            this.authService.doResetPassword(this.link, this.id, newPassword, confirmPassword).subscribe({
                next: () => {
                    this.passwordWasChanged = true;
                    this.formSetNewPassword.reset();
                },
                error: error => {
                    console.log(error);
                }
            });
        }
    }

    errorHandling = (control: string, error: string, form: FormGroup) => {
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

    checkChange(control: string, form: FormGroup) {
        const field = form.controls[control];

        if (!field.value) {
            field.markAsUntouched();
        }
    }
}

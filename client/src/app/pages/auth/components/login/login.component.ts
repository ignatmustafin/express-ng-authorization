import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
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
    }

    submit() {
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

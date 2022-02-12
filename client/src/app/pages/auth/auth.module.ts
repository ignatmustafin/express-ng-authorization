import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AccountVerificationComponent} from './components/account-verification/account-verification.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'registration', component: RegistrationComponent},
    {path: 'account-verification', component: AccountVerificationComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
]

@NgModule({
    declarations: [
        LoginComponent,
        RegistrationComponent,
        ResetPasswordComponent,
        AccountVerificationComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class AuthModule {
}

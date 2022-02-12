import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {AccountVerificationComponent} from './components/account-verification/account-verification.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent, data: {state: 'login'}},
    {path: 'registration', component: RegistrationComponent, data: {state: 'registration'}},
    {path: 'account-verification', component: AccountVerificationComponent, data: {state: 'accountVerification'}},
    {path: 'reset-password', component: ResetPasswordComponent, data: {state: 'resetPassword'}},
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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

import {StudySetsComponent} from './components/study-sets/study-sets.component';

const routes: Routes = [
    {path: '', component: StudySetsComponent},
];

@NgModule({
    declarations: [
        StudySetsComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ]
})
export class StudySetsModule {
}

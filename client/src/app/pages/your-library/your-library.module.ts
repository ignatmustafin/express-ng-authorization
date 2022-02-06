import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";

import {YourLibraryComponent} from './components/your-library/your-library.component';

const routes: Routes = [
    {path: '', component: YourLibraryComponent}
]

@NgModule({
    declarations: [
        YourLibraryComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class YourLibraryModule {
}

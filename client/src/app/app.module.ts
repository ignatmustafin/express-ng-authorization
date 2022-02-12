import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';

import {CoreModule} from "./core/core.module";
import {SharedModule} from "./shared/shared.module";

import {AppComponent} from './app.component';
import {ContentComponent} from "./layout/content/content.component";
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ContentComponent,
        FooterComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,

        CoreModule,
        SharedModule,
        BrowserAnimationsModule,
    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

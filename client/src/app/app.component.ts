import {Component} from '@angular/core';
import {trigger, transition, useAnimation} from "@angular/animations";
import {moveFromLeft, rotateCubeToLeft} from "ngx-router-animations";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('rotateCubeToLeft', [transition('* => *', useAnimation(rotateCubeToLeft))])
    ]
})
export class AppComponent {
    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }
}

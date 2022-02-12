import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {interval, take} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-account-verification',
    templateUrl: './account-verification.component.html',
    styleUrls: ['./account-verification.component.scss']
})
export class AccountVerificationComponent implements OnInit {

    public userEmail!: string;
    public isVerified!: boolean;
    public countDownSubscription: any;
    public countDownTime = 5;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe({
            next: result => {
                this.isVerified = result['before']
            }
        });

        if (this.isVerified) {
            this.countDownSubscription = interval(1000)
                .pipe(
                    take(5),
                    map(count => 5 - (count + 1))
                ).subscribe(seconds => {
                    this.countDownTime = seconds;

                    if (this.countDownTime === 0) {
                        this.countDownSubscription.unsubscribe();
                        localStorage.removeItem('confirm.email');
                        this.router.navigate(['/auth/login']);
                    }
                });
        } else {
            this.userEmail = JSON.parse(<string>localStorage.getItem('confirm.email'));
        }
    }
}

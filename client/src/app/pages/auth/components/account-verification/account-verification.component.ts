import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {interval, take} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-account-verification',
    templateUrl: './account-verification.component.html',
    styleUrls: ['./account-verification.component.scss']
})
export class AccountVerificationComponent implements OnInit {

    public userEmail!: string;
    public link !: string;
    public countDownSubscription: any;
    public countDownTime = 5;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe({
            next: result => {
                this.link = result['link'];
            }
        });

        if (this.link) {
            this.authService.doActivateAccount(this.link).subscribe({
                error: error => {
                    console.log(error)
                }
            });

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

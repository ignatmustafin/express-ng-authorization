import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../pages/auth/services/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pages = [
        {link: '/study-sets', title: 'Study sets'},
        {link: '/your-library', title: 'Your library'},
    ];

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
    }

    doSignOut() {
        this.authService.doSignOut().subscribe({
            next: () => {
                localStorage.removeItem('confirm');
                this.router.navigate(['/auth/login']);
            }
        });
    }
}

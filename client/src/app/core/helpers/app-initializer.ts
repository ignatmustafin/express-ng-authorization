import {AuthService} from "../../pages/auth/services/auth.service";

export function appInitializer(authService: AuthService) {
    return () => new Promise((resolve: any) => {
        const confirm: boolean = JSON.parse(<string>localStorage.getItem('confirm'));

        if (confirm) {
            authService.refreshToken()
                .subscribe({
                    next: response => {
                        console.log(response)
                    },
                    error: error => {
                        console.log(error)
                    }
                })
                .add(resolve);
        } else {
            resolve();
        }
    });
}

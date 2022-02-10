import {AuthService} from "../../pages/auth/services/auth.service";

export function appInitializer(authService: AuthService) {
    return () => new Promise((resolve: any) => {
        authService.refreshToken()
            .subscribe({
                next : response => {
                    console.log(response)
                },
                error : error => {
                    console.log(error)
                }
            })
            .add(resolve);
    });
}

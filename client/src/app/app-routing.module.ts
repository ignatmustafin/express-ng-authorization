import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ContentComponent} from "./layout/content/content.component";
import {AuthGuard} from "./core/guards/auth.guard";

const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: ContentComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'study-sets',
                loadChildren: () => import('./pages/study-sets/study-sets.module').then(m => m.StudySetsModule)
            },
            {
                path: 'your-library',
                loadChildren: () => import('./pages/your-library/your-library.module').then(m => m.YourLibraryModule)
            },
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

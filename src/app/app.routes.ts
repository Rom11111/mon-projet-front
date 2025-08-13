import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import {notLoggedGuard} from './guards/not-logged.guard';
import {loggedGuard} from './guards/logged.guard';

export const routes: Routes = [
    // ZONE PUBLIQUE
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            {path: 'login', loadComponent: () =>
                    import('./pages/auth/login/login.component').then(m => m.LoginComponent),
                canActivate: [notLoggedGuard],
                data: { title: 'Connexion' }
            },
            {
                path: 'signup',
                loadComponent: () =>
                    import('./pages/auth/signup/signup.component').then(m => m.SignupComponent),
                canActivate: [notLoggedGuard],
                data: { title: 'Inscription' }
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
                canActivate: [notLoggedGuard],
                data: { title: 'Mot de passe oublié' }
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
                canActivate: [notLoggedGuard],
                data: { title: 'Réinitialisation du mot de passe' }
            },
            {
                path: 'validate-mail/:token',
                loadComponent: () =>
                    import('./pages/email-validation/email-validation.component').then(m => m.EmailValidationComponent),
                data: { title: 'Validation de l\'email' }
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    {
        path: '',
        component: ClientLayoutComponent,
        canActivate: [loggedGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { title: 'Tableau de bord' } },
            { path: 'equipments', loadComponent: () => import('./pages/products/equipments/equipments.component').then(m => m.EquipmentsComponent), data: { title: 'Équipements' } },
            { path: 'rental', loadComponent: () => import('./pages/rental/rental.component').then(m => m.RentalComponent), data: { title: 'Locations' } },
            { path: 'my-rentals', loadComponent: () => import('./pages/rental/my-rentals.component').then(m => m.MyRentalsComponent), data: { title: 'My Rentals' }},
            { path: 'clients', loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent), data: { title: 'Clients' } },
            { path: 'team', loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent), data: { title: 'Équipe' } },
            { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent), data: { title: 'Contact' } },
            { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent), data: { title: 'Paramètres' } },
            { path: 'ajout-produit', loadComponent: () => import('./pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), data: { title: 'Ajouter un produit' } },
            { path: 'modifier-produit/:id', loadComponent: () => import('./pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), data: { title: 'Modifier le produit' } },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    { path: '**', loadComponent: () => import('./pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page non trouvée' } }
];

// app.routes.ts
import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

import { notLoggedGuard } from './guards/not-logged.guard';
import { loggedGuard } from './guards/logged.guard';
import { roleGuard } from './guards/role.guard';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
    // --- ZONE PUBLIQUE ---
    { path: '', component: LoginLayoutComponent, children: [
            { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent), canActivate: [notLoggedGuard], data: { title: 'Connexion' } },
            { path: 'signup', loadComponent: () => import('./pages/auth/signup/signup.component').then(m => m.SignupComponent), canActivate: [notLoggedGuard], data: { title: 'Inscription' } },
            { path: 'forgot-password', loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), canActivate: [notLoggedGuard], data: { title: 'Mot de passe oublié' } },
            { path: 'reset-password', loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent), canActivate: [notLoggedGuard], data: { title: 'Réinitialisation du mot de passe' } },
            { path: 'validate-mail/:token', loadComponent: () => import('./pages/email-validation/email-validation.component').then(m => m.EmailValidationComponent), data: { title: 'Validation de l\'email' } },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]},

    // --- ZONE AUTHENTIFIÉE ---
    { path: '', component: MainLayoutComponent, canActivate: [loggedGuard], children: [
            // Pages accessibles à tous les rôles connectés (pas de data.roles)
            { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { title: 'Tableau de bord' } },
            { path: 'equipments', loadComponent: () => import('./pages/products/equipments/equipments.component').then(m => m.EquipmentsComponent), data: { title: 'Équipements' } },
            { path: 'rental', loadComponent: () => import('./pages/rental/rental.component').then(m => m.RentalComponent), data: { title: 'Locations' } },
            { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent), data: { title: 'Contact' } },
            { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent), data: { title: 'Paramètres' } },

            // CLIENT uniquement
            { path: 'my-rentals', loadComponent: () => import('./pages/rental/my-rentals.component').then(m => m.MyRentalsComponent), canActivate: [roleGuard], data: { title: 'My Rentals', roles: ['CLIENT'] } },
            { path: 'my-reports', loadComponent: () => import('./pages/report/my-reports/my-reports.component').then(m => m.MyReportsComponent), canActivate: [roleGuard], data: { title: 'Mes signalements', roles: ['CLIENT'] } },

            // ADMIN/TECH
            { path: 'all-reports', loadComponent: () => import('./pages/report/all-reports/all-reports.component').then(m => m.AllReportsComponent), canActivate: [roleGuard], data: { title: 'Tous les signalements', roles: ['ADMIN', 'TECH'] } },
            { path: 'clients', loadComponent: () => import('./pages/clients/clients.component').then(m => m.ClientsComponent), canActivate: [roleGuard], data: { title: 'Clients', roles: ['ADMIN', 'TECH'] } },
            { path: 'team', loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent), canActivate: [roleGuard], data: { title: 'Équipe', roles: ['ADMIN', 'TECH'] } },
            { path: 'ajout-produit', loadComponent: () => import('./pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), canActivate: [roleGuard], data: { title: 'Ajouter un produit', roles: ['ADMIN', 'TECH'] } },
            { path: 'modifier-produit/:id', loadComponent: () => import('./pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), canActivate: [roleGuard], data: { title: 'Modifier le produit', roles: ['ADMIN', 'TECH'] } },

            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]},

    // Page "non autorisé" (si tu l’utilises dans le guard)
    { path: 'unauthorized', loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent), data: { title: 'Accès refusé' } },

    // 404
    { path: '**', loadComponent: () => import('./pages/page404/page404.component').then(m => m.Page404Component), data: { title: 'Page non trouvée' } }
];

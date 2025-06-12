import {Routes} from '@angular/router';
import {Page404Component} from './pages/page404/page404.component';
import {EditProductComponent} from './pages/edit-product/edit-product.component';
import {LoginComponent} from './pages/login/login.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {RentalComponent} from './pages/rental/rental.component';
import {EquipmentsComponent} from './pages/equipments/equipments.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {loggedGuard} from './services/logged.guard';
import {notLoggedGuard} from './services/not-logged.guard'; // À créer si nécessaire
import {ClientsComponent} from './pages/clients/clients.component';
import {EmailValidationComponent} from './pages/email-validation/email-validation.component';
import {SignupComponent} from './pages/signup/signup.component';
import {ContactComponent} from './pages/contact/contact.component';
import {TeamComponent} from './pages/team/team.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
    // Routes d'authentification
        {
            path: '',
            component: LoginLayoutComponent,
            children: [
        {
            path: "login",
            component: LoginComponent,
            canActivate: [notLoggedGuard], // Optionnel: empêcher les utilisateurs déjà connectés d'accéder à la page de connexion
            data: { title: 'Connexion' } // Utile pour le titre de la page
        },
        {
            path: 'validate-mail/:token',
            component: EmailValidationComponent
        },
        {
            path: "signup",
            component: SignupComponent,
            canActivate: [notLoggedGuard], // Optionnel: empêcher les utilisateurs déjà connectés d'accéder à la page d'inscription
            data: { title: 'Inscription' } // Utile pour le titre de la page
        }
    ]
},

    // Layout principal (protégé)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [loggedGuard], // Protection globale
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'equipments', component: EquipmentsComponent },
            { path: 'rental', component: RentalComponent },
            { path: 'clients', component: ClientsComponent },
            { path: 'team', component: TeamComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'ajout-produit', component: EditProductComponent },
            { path: 'modifier-produit/:id', component: EditProductComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Route 404 - doit toujours être la dernière
    { path: '**', component: Page404Component }
];

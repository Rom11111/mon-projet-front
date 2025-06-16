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
                {path: 'login', component: LoginComponent, canActivate: [notLoggedGuard], data: { title: 'Connexion' }},
                {path: 'signup', component: SignupComponent, canActivate: [notLoggedGuard], data: { title: 'Inscription' }},
                {path: 'validate-mail/:token', component: EmailValidationComponent,data: { title: 'Validation de l\'email' }},
                {path: '', redirectTo: 'login', pathMatch: 'full'}
            ]
        },

    // Layout principal (protégé)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [loggedGuard], // Protection globale
        children: [
            {path: 'dashboard', component: DashboardComponent, data: {title: 'Tableau de bord'}},
            {path: 'equipments', component: EquipmentsComponent, data: {title: 'Équipements'}},
            {path: 'rental', component: RentalComponent, data: {title: 'Locations'}},
            {path: 'clients', component: ClientsComponent, data: {title: 'Clients'}},
            {path: 'team', component: TeamComponent, data: {title: 'Équipe'}},
            {path: 'contact', component: ContactComponent, data: {title: 'Contact'}},
            {path: 'settings', component: SettingsComponent, data: {title: 'Paramètres'}},
            {path: 'ajout-produit', component: EditProductComponent, data: {title: 'Ajouter un produit'}},
            {path: 'modifier-produit/:id', component: EditProductComponent, data: {title: 'Modifier le produit'}},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    },

            // Route 404 - doit toujours être la dernière
            { path: '**', component: Page404Component, data: { title: 'Page non trouvée' }}
];


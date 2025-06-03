import {Routes} from '@angular/router';
import {AccueilComponent} from './pages/accueil/accueil.component';

import {Page404Component} from './pages/page404/page404.component';
import {EditProductComponent} from './pages/edit-product/edit-product.component';
import {LoginComponent} from './pages/login/login.component';

import {SettingsComponent} from './pages/settings/settings.component';
import {BookingComponent} from './pages/rental/rental.component';
import {EquipmentsComponent} from './pages/equipments/equipments.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {loggedGuard} from './services/logged.guard';
import { ClientsComponent } from './pages/clients/clients.component';
import {EmailValidationComponent} from './pages/email-validation/email-validation.component';
import {SignupComponent} from './pages/signup/signup.component';
import {ContactComponent} from './pages/contact/contact.component';
import {TeamComponent} from './pages/team/team.component';

export const routes: Routes = [

    {path: "login", component: LoginComponent},
    {path: "signup", component: SignupComponent},

    {path: "dashboard", component: DashboardComponent, canActivate:[ loggedGuard]},
    {path: "equipments", component: EquipmentsComponent},
    {path: "booking", component: BookingComponent},
    {path: "clients", component: ClientsComponent},
    {path: "team", component: TeamComponent},
    {path: "contact", component: ContactComponent },
    {path: "settings", component: SettingsComponent},

    {path: "validate-mail/:token", component: EmailValidationComponent},
    //{path: "accueil", component: AccueilComponent, canActivate:[ loggedGuard] },
    {path: "ajout-produit", component: EditProductComponent},
    {path: "modifier-produit/:id", component: EditProductComponent},
    {path: "", redirectTo: "accueil", pathMatch: "full"},

    {path: "**", component: Page404Component},

];

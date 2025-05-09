import {Routes} from '@angular/router';
import {AccueilComponent} from './pages/accueil/accueil.component';

import {Page404Component} from './pages/page404/page404.component';
import {EditProductComponent} from './pages/edit-product/edit-product.component';
import {LoginComponent} from './pages/login/login.component';

import {SettingsComponent} from './pages/settings/settings.component';
import {BookingComponent} from './pages/booking/booking.component';
import {EquipmentsComponent} from './pages/equipments/equipments.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {loggedGuard} from './services/logged.guard';
import { ClientsComponent } from './pages/clients/clients.component';



export const routes: Routes = [

    {path: "login", component: LoginComponent},

    {path: "dashboard", component: DashboardComponent},
    {path: "equipments", component: EquipmentsComponent},
    {path: "booking", component: BookingComponent},
    {path: "clients", component: ClientsComponent},
    {path: "settings", component: SettingsComponent},


    {path: "accueil", component: AccueilComponent, canActivate:[ loggedGuard] },
    {path: "ajout-produit", component: EditProductComponent},
    {path: "modifier-produit/:id", component: EditProductComponent},
    {path: "", redirectTo: "accueil", pathMatch: "full"},

    {path: "**", component: Page404Component},

];

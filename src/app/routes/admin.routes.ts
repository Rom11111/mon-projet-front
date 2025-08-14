import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    { path: 'dashboard', loadComponent: () => import('../pages/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { title: 'Tableau de bord' } },
    { path: 'equipments', loadComponent: () => import('../pages/products/equipments/equipments.component').then(m => m.EquipmentsComponent), data: { title: 'Équipements' } },
    { path: 'rental', loadComponent: () => import('../pages/rental/rental.component').then(m => m.RentalComponent), data: { title: 'Locations' } },
    { path: 'clients', loadComponent: () => import('../pages/clients/clients.component').then(m => m.ClientsComponent), data: { title: 'Clients' } },
    { path: 'team', loadComponent: () => import('../pages/team/team.component').then(m => m.TeamComponent), data: { title: 'Équipe' } },
    { path: 'contact', loadComponent: () => import('../pages/contact/contact.component').then(m => m.ContactComponent), data: { title: 'Contact' } },
    { path: 'settings', loadComponent: () => import('../pages/settings/settings.component').then(m => m.SettingsComponent), data: { title: 'Paramètres' } },
    { path: 'ajout-produit', loadComponent: () => import('../pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), data: { title: 'Ajouter un produit' } },
    { path: 'modifier-produit/:id', loadComponent: () => import('../pages/products/edit-product/edit-product.component').then(m => m.EditProductComponent), data: { title: 'Modifier le produit' } }
];


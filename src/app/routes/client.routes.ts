import { Routes } from '@angular/router';

export const clientRoutes: Routes = [
    { path: 'contact', loadComponent: () => import('../pages/contact/contact.component').then(m => m.ContactComponent), data: { title: 'Contact' } },
    { path: 'settings', loadComponent: () => import('../pages/settings/settings.component').then(m => m.SettingsComponent), data: { title: 'Paramètres' } },
];

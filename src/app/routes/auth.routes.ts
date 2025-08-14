import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    { path: 'login', loadComponent: () => import('../pages/auth/login/login.component').then(m => m.LoginComponent), data: { title: 'Connexion' } },
    { path: 'signup', loadComponent: () => import('../pages/auth/signup/signup.component').then(m => m.SignupComponent), data: { title: 'Inscription' } },
    { path: 'forgot-password', loadComponent: () => import('../pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent), data: { title: 'Mot de passe oublié' } },
    { path: 'reset-password', loadComponent: () => import('../pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent), data: { title: 'Réinitialisation du mot de passe' } },
    { path: 'validate-mail/:token', loadComponent: () => import('../pages/email-validation/email-validation.component').then(m => m.EmailValidationComponent), data: { title: 'Validation de l\'email' } },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

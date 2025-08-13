import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './services/jwt.interceptor';
import { errorInterceptor } from './interceptor/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';
import { apiInterceptor } from './interceptor/api.service';

import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr); // 🇫🇷 Active le français

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimations(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([apiInterceptor, errorInterceptor, jwtInterceptor])),
        Title,
        { provide: LOCALE_ID, useValue: 'fr-FR' }, // Ajoute la locale FR
        provideNativeDateAdapter()                 // Active le calendrier natif
    ]
};

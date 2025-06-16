import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {jwtInterceptor} from './services/jwt.interceptor';
import {errorInterceptor} from './interceptor/error.interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Title} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [

        provideZoneChangeDetection({eventCoalescing: true}),
        provideAnimations(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor])),
        Title
    ]
};

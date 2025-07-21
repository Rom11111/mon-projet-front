import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import {environment} from '../../environments/environment';



export function apiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const router = inject(Router);

    /// On ajoute automatiquement l'URL de base (ex : http://localhost:8080) à toutes les requêtes
    const newReq = req.clone({
        url: `${environment.serverUrl.replace(/\/$/, '')}/${req.url.replace(/^\//, '')}`,
    });

    return next(newReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si le serveur répond 404, on redirige vers une page Not Found
            if (error.status === 404) {
                router.navigate(['/not-found']);
            }
            // On relance l'erreur pour qu'elle puisse être gérée ailleurs aussi
            return throwError(() => error);
        })
    );
}

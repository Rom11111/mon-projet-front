import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);
    //l'intercepteur global permet de gérer les errors qui produirai toujours le meme effet
    //dans le cas d'une application front end , les error 401, 402, 403, 413, 429, 503, 509 sont de potentielles candidats
    //mais la gestion en amont de certaines error (ex : 401 et 403 via des guards), ou le contexte de l'app, rend
    // leur gestion complétement subjective

    //note le status 0 de l'error est reçu si le serveur est injoignable
    //on verifie en plus si il n'y a pas déjà une tentative de reconnection automatique
    // en cours pour ne pas surcharger de message inutiles
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message: string;

            switch (error.status) {
                case 0:
                    message = "Le serveur est injoignable, veuillez vérifier votre connexion, et contacter votre administrateur si le problème persiste";
                    break;

                case 400:
                    message = "Les données fournies sont invalides. Veuillez vérifier vos informations.";
                    break;

                case 401:
                    message = "Vous devez vous connecter pour accéder à cette ressource.";
                    break;

                case 403:
                    message = "Vous n'avez pas les droits nécessaires pour accéder à cette ressource.";
                    break;

                case 409:
                    message = "Cet email est déjà utilisé. Veuillez en choisir un autre.";
                    break;

                case 500:
                    message = "Une erreur inconnue est survenue, veuillez contacter votre administrateur";
                    break;

                default:
                    message = "Une erreur est survenue. Veuillez réessayer plus tard.";
            }

            // Remplace alert() par MatSnackBar pour une meilleure expérience utilisateur
            snackBar.open(message, 'Fermer', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
            });

            throw error;
        })
    );
};


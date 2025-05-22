import { HttpInterceptorFn } from '@angular/common/http';
import {catchError} from 'rxjs';
import {inject} from '@angular/core';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {



    return next(req).pipe(
        catchError(error => {

            //l'intercepteur global permet de gérer les errors qui produirai toujours le meme effet
            //dans le cas d'une application front end , les error 401, 402, 403, 413, 429, 503, 509 sont de potentielles candidats
            //mais la gestion en amont de certaines error (ex : 401 et 403 via des guards), ou le contexte de l'app, rend
            // leur gestion complétement subjective

            //note le status 0 de l'error est reçu si le serveur est injoignable
            //on verifie en plus si il n'y a pas déjà une tentative de reconnection automatique
            // en cours pour ne pas surcharger de message inutiles
            if (error.status === 0 ) {

                alert("Le serveur est injoignable, veuillez vérifier votre connexion, et contacter votre administrateur si le problème persiste");
            } else if (error.status === 500) {
                alert("Une error inconnue est survenue, veuillez contacter votre administrateur");
            }
            throw(error);
        })
    );
};

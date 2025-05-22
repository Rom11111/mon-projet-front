
import {BehaviorSubject, catchError, interval, Observable, of, Subject, Subscription, switchMap, tap} from 'rxjs';
import {inject, Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoggedService implements OnDestroy {
    readonly isChecking$ = new BehaviorSubject<boolean>(false);
    readonly durationNextHealthCheck$ = new BehaviorSubject<number>(10); // Initialisé à 10 secondes
    readonly loggedReestablished$ =  new Subject<void>()
    private http = inject(HttpClient);
    private checkSubscription: Subscription | null = null;
    private countdownSubscription: Subscription | null = null;

    // Méthode pour vérifier la connexion
    checklogged(): Observable<boolean> {
        return this.http.get('http://localhost:3000/health', { responseType: 'text' }).pipe(
            tap(() => console.log('logged established')),
            switchMap(() => of(true)),
            catchError(() => of(false))
        );
    }

    // Méthode pour démarrer la vérification périodique
    startPeriodicCheck(): void {
        if (!this.isChecking$.value) {
            this.isChecking$.next(true);
            this.durationNextHealthCheck$.next(10); // Réinitialiser le compte à rebours

            this.checkSubscription = interval(10000).pipe(
                switchMap(() => this.checklogged())
            ).subscribe(isConnected => {
                if (isConnected) {
                    this.stopPeriodicCheck();
                    alert('logged reestablished!');
                    this.loggedReestablished$.next();
                } else {
                    console.error("Connexion échouée, nouvelle tentative dans 10 secondes");
                    this.durationNextHealthCheck$.next(10); // Réinitialiser le compte à rebours
                }
            });

            // Démarrer le compte à rebours
            this.startCountdown();
        }
    }

    // Méthode pour démarrer le compte à rebours
    private startCountdown(): void {
        this.countdownSubscription = interval(1000).subscribe(() => {
            const currentValue = this.durationNextHealthCheck$.value;
            if (currentValue > 0) {
                this.durationNextHealthCheck$.next(currentValue - 1);
            }
        });
    }

    // Méthode pour arrêter la vérification périodique
    stopPeriodicCheck(): void {
        if (this.checkSubscription) {
            this.checkSubscription.unsubscribe();
            this.checkSubscription = null;
        }
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
            this.countdownSubscription = null;
        }
        this.isChecking$.next(false);
        this.durationNextHealthCheck$.next(0); // Réinitialiser le compte à rebours
    }

    // Nettoyer les abonnements lorsque le service est détruit
    ngOnDestroy(): void {
        this.stopPeriodicCheck();
    }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class LoginComponent {

    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);
    private auth = inject(AuthService);
    private notification = inject(NotificationService);

    // Création du formulaire avec valeurs par défaut pour faciliter les tests
    form = this.fb.group({
        email: ['a@a.com', [Validators.required, Validators.email]],
        password: ['root', Validators.required]
    });

    onLogin(): void {
        if (this.form.valid) {
            // Appel HTTP au backend pour récupérer un JWT
            this.http.post('/login', this.form.value, { responseType: 'text' })
                .subscribe({
                    next: jwt => {
                        // Décodage du JWT pour stocker les infos utilisateur
                        this.auth.decodeJwt(jwt);
                        this.notification.show('Connexion réussie', 'valid');
                        this.router.navigateByUrl('/dashboard');
                    },
                    error: err => {
                        if (err.status === 401) {
                            this.notification.show('Mauvais email ou mot de passe', 'error');
                        } else {
                            this.notification.show('Erreur serveur', 'error');
                        }
                    }
                });
        } else {
            // Le formulaire est invalide (ex : champ vide)
            this.notification.show('Formulaire invalide', 'error');
        }
    }
}

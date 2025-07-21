import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);
    private notification = inject(NotificationService);

    // Formulaire avec un champ email requis
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    // Méthode appelée lors de la soumission
    onResetRequest(): void {
        if (this.form.valid) {
            const email = this.form.value.email;

            // Appel à l'API pour demander un reset de mot de passe
            this.http.post(`${environment.serverUrl}/forgot-password`, { email }, { responseType: 'text' })
                .subscribe({
                    next: () => {
                        this.notification.show('Lien de réinitialisation envoyé par email', 'valid');
                        this.router.navigateByUrl('/login');
                    },
                    error: () => {
                        this.notification.show('Erreur lors de l’envoi du lien', 'error');
                    }
                });
        } else {
            this.notification.show('Email invalide', 'error');
        }
    }
}


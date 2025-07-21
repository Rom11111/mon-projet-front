import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../services/notification.service';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule
    ]
})
export class ResetPasswordComponent {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private notification = inject(NotificationService);

    // Formulaire avec validation personnalisée
    form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirm: ['', Validators.required]
    }, {
        validators: (group) => {
            const password = group.get('password')?.value;
            const confirm = group.get('confirm')?.value;
            return password === confirm ? null : { mismatch: true };
        }
    });

    onResetPassword(): void {
        if (this.form.valid) {
            const token = this.route.snapshot.queryParamMap.get('token'); // récupère le token de l'URL

            if (!token) {
                this.notification.show('Lien invalide ou expiré', 'error');
                return;
            }

            const { password } = this.form.value;

            // Envoi à l'API
            this.http.post(`${environment.serverUrl}/reset-password`, { token, password }, { responseType: 'text' })
                .subscribe({
                    next: () => {
                        this.notification.show('Mot de passe réinitialisé', 'valid');
                        this.router.navigateByUrl('/login');
                    },
                    error: () => {
                        this.notification.show('Erreur lors de la réinitialisation', 'error');
                    }
                });

        } else {
            this.notification.show('Formulaire invalide', 'error');
        }
    }
}


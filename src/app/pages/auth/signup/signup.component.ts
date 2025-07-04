import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {NotificationService} from '../../../services/notification.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-inscription',
    standalone: true,
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
    imports: [
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class SignupComponent {

    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private router = inject(Router);
    private notification = inject(NotificationService);

    form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    onSignup(): void {
        if (this.form.valid) {
            this.http.post(environment.serverUrl + 'inscription', this.form.value).subscribe({
                next: () => {
                    this.router.navigateByUrl('/connexion');
                    this.notification.show(
                        'Un lien de confirmation vous a été envoyé par mail. Cliquez dessus avant de vous connecter.',
                        'warning'
                    );
                },
                error: err => {
                    if (err.status === 409) {
                        this.notification.show('Cet email est déjà utilisé', 'error');
                    } else {
                        this.notification.show('Erreur lors de l\'inscription', 'error');
                    }
                }
            });
        }
    }
}

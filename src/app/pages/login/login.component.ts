import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: true
})
export class LoginComponent {
    private formBuilder = inject(FormBuilder);
    private notification = inject(NotificationService);
    private auth = inject(AuthService);

    form = this.formBuilder.group({
        email: [environment.production ? '' : 'a@a.com', [Validators.required, Validators.email]],
        password: [environment.production ? '' : 'root', [Validators.required]]
    });


    onLogin(): void {
        if (this.form.valid) {
            this.auth.signIn({
                email: this.form.value.email!,
                password: this.form.value.password!
            }).subscribe({
                next: () => {
                    this.notification.show('Connexion réussie', 'valid');
                    this.auth.redirectBasedOnRole();
                },
                error: error => {
                    if (error.status === 401) {
                        this.notification.show('Email ou mot de passe incorrect', 'error');
                    } else {
                        this.notification.show('Erreur lors de la connexion', 'error');
                    }
                }
            });
        } else {
            this.notification.show('Veuillez remplir tous les champs correctement', 'error');
        }
    }
}

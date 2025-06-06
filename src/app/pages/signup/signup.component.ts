import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private authService = inject(AuthService);

    public form: FormGroup;
    public onError = '';

    constructor() {
        this.form = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordsMatchValidator
        });
    }

    passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    submit() {
        if (this.form.invalid) {
            return;
        }
        // On ne garde que les champs nécessaires pour l'API
        const { firstName, lastName, email, password } = this.form.value;

        this.authService.register({ firstName, lastName, email, password }).subscribe({
            next: () => {
                // Redirection vers la page de login après une inscription réussie
                this.router.navigate(['/login']);
            },
            error: (err) => {
                // Gestion des erreurs (par exemple, si l'email existe déjà)
                this.onError = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
                console.error(err);
            }
        });
    }
}

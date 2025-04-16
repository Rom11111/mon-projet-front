import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationService} from '../../services/notification.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        MatFormField,
        FormsModule,
        MatButtonModule,
        MatInputModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    formBuilder = inject(FormBuilder)
    http = inject(HttpClient)
    notification = inject(NotificationService)
    auth = inject(AuthService)
    router = inject (Router)

    form = this.formBuilder.group({
        email: ["a@a.com", [Validators.required, Validators.email]],
        password: ["root", [Validators.required]],


    })

    onLogin() {
        if (this.form.valid) {

            this.http
            .post(
            "http://localhost:8080/login",
            this.form.value,
            {responseType: "text"})
            .subscribe({
            next : jwt => {
                this.auth.connected = true // à revoir
                this.auth.decodeJwt(jwt)
                this.router.navigateByUrl("/accueil") // Une fois connecté, dirige vers la page d'accueil
            }, // stock sur le navigateur
            error : error => {
                if(error.status === 401) {
                    //reçois des erreurs à partir de 300
                    this.notification.show("Mauvais login/ mot de passe", "error")
            }

        }
    })
    }
}
}

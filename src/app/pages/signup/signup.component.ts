import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {

    formBuilder = inject(FormBuilder)
    http = inject(HttpClient)
    notification = inject(NotificationService)
    auth = inject(AuthService)
    router = inject (Router)

    form = this.formBuilder.group({
        email: ["z@z.com", [Validators.required, Validators.email]],
        password: ["root", [Validators.required]],


    })

    onLogin() {
        if (this.form.valid) {

            this.http
                .post(
                    "environment.serveUrl +signup",
                    this.form.value,)
                .subscribe({
                    next : jwt => {
                        this.auth.connected = true // à revoir
                        this.router.navigateByUrl("/login")
                        this.notification.show("Un lien de confirmation vous a été envoyé sur l'adresse email que vous avez fourni," +
                        "cliquez sur ce lien avant de vous connecter","warning")
                    }, // stock sur le navigateur
                    error : error => {
                        if(error.status === 409) {
                            //reçois des erreurs à partir de 300
                            this.notification.show("Cet email est déjà utilisé", "error")
                        }

                    }
                })
        }
    }
}

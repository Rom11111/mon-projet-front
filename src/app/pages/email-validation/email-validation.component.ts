import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NotificationService} from '../../services/notification.service';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-email-validation',
    imports: [
        MatButton
    ],
  templateUrl: './email-validation.component.html',
  styleUrl: './email-validation.component.scss'
})
export class EmailValidationComponent implements OnInit {


    activatedRoute = inject(ActivatedRoute)
    notification = inject(NotificationService)
    http = inject(HttpClient)
    router = inject(Router)
    token?: string;

    ngOnInit() {
        this.activatedRoute.params
            .subscribe(parameters => {

                if (parameters['token']) {
                    this.token = parameters['token']
                }
            })
    }

    onSignupValidation() {
        if (this.token) {
            this.http
                .post<{
                    token: string,
                    consentToDataUse: boolean
                }>("environment.serverUrl +/validate-email", {token: this.token, consentToDataUse: true})
                .subscribe({
                    next: result => {
                        this.notification.show("Votre inscription est finalisée, vous pouvez à présent vous connecter", "valid")
                        this.router.navigateByUrl("/login")
                    }
                })
        }
    }
}


// repo Franck

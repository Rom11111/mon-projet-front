import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    notification = inject(MatSnackBar);

    show(message: string, type: "valid" | "error" | "warning" | "info" = "info") {
        this.notification.open(message, "Fermer", {
            duration: 5000,
            verticalPosition: "top",
            horizontalPosition: "center",
            panelClass: [`notification-${type}`]
        });
    }
}




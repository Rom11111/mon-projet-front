import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {NotificationDialogComponent} from '../components/notification-dialog/notification-dialog.component';


@Injectable({ providedIn: 'root' })
export class NotificationService {
    private dialog = inject(MatDialog);

    show(message: string, type: 'valid' | 'error' | 'warning' | 'info' = 'info', title = 'Notification') {
        this.dialog.open(NotificationDialogComponent, {
            data: { title, message, type },
            width: '400px'
        });
    }

    success(msg: string, title = 'Succès') {this.show(msg, 'valid', title);}
    error(msg: string, title = 'Erreur') {this.show(msg, 'error', title);}
    warning(msg: string, title = 'Avertissement') {this.show(msg, 'warning', title);}
    info(msg: string, title = 'Information') {this.show(msg, 'info', title);}
}

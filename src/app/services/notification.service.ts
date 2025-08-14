import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {NotificationDialogComponent} from '../components/notification-dialog/notification-dialog.component';


@Injectable({ providedIn: 'root' })
export class NotificationService {

    // Injecte le service Angular Material pour ouvrir une boîte de dialogue
    private dialog = inject(MatDialog);

    /**
     * Affiche une pop-up avec un message, un titre et un type (couleur/icône)
     * @param message - contenu de la notification
     * @param type - 'valid', 'error', 'warning', ou 'info' (par défaut)
     * @param title - titre affiché dans la boîte
     */
    show(message: string, type: 'valid' | 'error' | 'warning' | 'info' = 'info', title = 'Notification') {
        this.dialog.open(NotificationDialogComponent, {
            data: { title, message, type },
            width: '400px'
        });
    }
    // Méthodes pratiques pour appeler directement une notif selon le type
    success(msg: string, title = 'Succès') {this.show(msg, 'valid', title);}
    error(msg: string, title = 'Erreur') {this.show(msg, 'error', title);}
    warning(msg: string, title = 'Avertissement') {this.show(msg, 'warning', title);}
    info(msg: string, title = 'Information') {this.show(msg, 'info', title);}
}

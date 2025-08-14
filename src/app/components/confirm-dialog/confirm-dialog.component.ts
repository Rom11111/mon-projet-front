import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    standalone: true,
    imports: [
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatButton
    ]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            title: string;
            message: string;
            confirmButtonText?: string; // Texte personnalisé pour le bouton de validation
            cancelButtonText?: string;  // Texte personnalisé pour le bouton d’annulation
        }
    ) {}

    // Appelé quand l'utilisateur clique sur "Valider" (ou autre)
    onConfirm(): void {
        this.dialogRef.close(true);
    }

    // Appelé quand l'utilisateur clique sur "Annuler"
    onCancel(): void {
        this.dialogRef.close(false);
    }
}

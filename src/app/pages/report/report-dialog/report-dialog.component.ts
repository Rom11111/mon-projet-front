import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Imports Angular Material nécessaires
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-report-dialog',
    standalone: true, // Composant standalone
    imports: [
        FormsModule, // Pour utiliser [(ngModel)]
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './report-dialog.component.html'
})
export class ReportDialogComponent {
    description: string = ''; // Contenu du champ description

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<ReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any // Récupère les données passées à la modale
    ) {}

    // Envoie le signalement au backend
    submitReport() {
        this.http.post(`rentals/${this.data.rentalId}/report`, {
            description: this.description
        }).subscribe({
            next: () => {
                this.dialogRef.close(true); // ferme la modale si OK
            }
        });


    }
}

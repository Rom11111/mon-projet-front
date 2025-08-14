import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { DocumentService } from '../../../services/document.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import {NotificationDialogComponent} from '../../../components/notification-dialog/notification-dialog.component';
import {AuthService} from '../../../services/auth.service';


@Component({
    selector: 'app-view-documents-dialog',
    standalone: true,
    templateUrl: './view-documents-dialog.component.html',
    styleUrls: ['./view-documents-dialog.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatTooltip,
        NgOptimizedImage
    ]
})
export class ViewDocumentsDialogComponent {
    dataSource = new MatTableDataSource<any>([]);
    displayedColumns = ['title', 'type', 'actions'];
    isTechOrAdmin = false;

    constructor(
        private dialogRef: MatDialogRef<ViewDocumentsDialogComponent>,
        private documentService: DocumentService,
        private dialog: MatDialog,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public productId: number
    ) {
        this.isTechOrAdmin = this.authService.hasAnyRole(['ADMIN', 'TECH']);
        this.loadDocuments();
    }

    loadDocuments() {
        this.documentService.getDocuments(this.productId).subscribe({
            next: res => this.dataSource.data = res.data,
            error: err => console.error('Erreur lors du chargement des documents :', err)
        });
    }

    download(doc: any): void {
        this.documentService.downloadDocument(this.productId, doc.id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        });
    }

    delete(docId: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Confirmer la suppression',
                message: 'Voulez-vous vraiment supprimer ce document ?',
                confirmButtonText: 'Supprimer',
                cancelButtonText: 'Annuler'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.documentService.deleteDocument(docId).subscribe(() => {
                    this.dataSource.data = this.dataSource.data.filter(d => d.id !== docId);

                    // ✅ Ouvre la notification avec le bon message
                    this.dialog.open(NotificationDialogComponent, {
                        width: '400px',
                        data: {
                            title: 'Succès',
                            message: 'Document supprimé avec succès.',
                            type: 'valid'
                        }
                    });
                });
            }
        });
    }


    close(): void {
        this.dialogRef.close(false); // ou juste this.dialogRef.close();
    }
}

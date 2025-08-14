import { Component, Inject } from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { DocumentService } from '../../../services/document.service';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-upload-document-dialog',
    templateUrl: './upload-document-dialog.component.html',
    styleUrls: ['./upload-document-dialog.component.scss'],
    standalone: true,
    imports: [

        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions
    ]
})
export class UploadDocumentDialogComponent {
    form: FormGroup;
    file: File | null = null;

    documentTypes = [
        { value: 'MANUAL', label: 'Notice utilisateur' },
        { value: 'TECH_DOC', label: 'Doc technique' },
        { value: 'VIDEO', label: 'Vidéo' },
        { value: 'IMAGE', label: 'Image' }
    ];

    constructor(
        private fb: FormBuilder,
        private docService: DocumentService,
        private dialogRef: MatDialogRef<UploadDocumentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public productId: number
    ) {
        this.form = this.fb.group({
            type: ['MANUAL', Validators.required],
            title: ['', Validators.required]
        });
    }

    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            this.file = target.files[0];
        }
    }

    onSubmit(): void {
        if (!this.form.valid || !this.file) return;

        const {type, title} = this.form.value;

        this.docService.uploadDocument(this.productId, this.file, type, title).subscribe({
            next: (res) => {
                console.log('Upload réussi :', res);
                this.dialogRef.close(true);
            },
            error: (err) => {
                console.error('Erreur lors de l’upload :', err);

                // Cas où le backend retourne 200 + message texte, mais Angular le prend pour une erreur
                if (err.status === 200 && typeof err.error === 'string' && err.error.includes('succès')) {
                    console.warn('Erreur faussement détectée, mais succès côté serveur.');
                    this.dialogRef.close(true);
                } else {
                    this.dialogRef.close(false);
                }
            }
        });
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}


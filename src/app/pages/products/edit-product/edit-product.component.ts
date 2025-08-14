import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { NotificationService } from '../../../services/notification.service';
import { ProductService } from '../../../services/crud/product.service';
import { CategoryService } from '../../../services/category.service';
import { FileChooserComponent } from '../../../components/file-chooser/file-chooser.component';

import { Product } from '../../../models/product';
import { Category } from '../../../models/category';
import { Etat } from '../../../models/etat';
import {MatDialogActions} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {EtatService} from '../../../services/etat.service';

@Component({
    selector: 'app-edit-product',
    standalone: true,
    imports: [CommonModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule, FormsModule, FileChooserComponent, MatDialogActions],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {

    // Injections
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private notify = inject(NotificationService);
    private productService = inject(ProductService);
    private categoryService = inject(CategoryService);
    private etatService = inject(EtatService);

    // États UI / données
    photo?: File | null = null;
    etats: Etat[] = [];
    categories: Category[] = [];
    editedProduct: Product | null = null;  // null => ajout
    isEditMode = false;                    // flag de mode, basé sur l’URL

    // Formulaire
    form = this.fb.group({
        name: ['Nouveau produit', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        code: ['1234', [Validators.required]],
        description: ['Une description'],
        stock: [0, [Validators.required, Validators.min(0)]],   // ✅ stock présent
        price: [15.99, [Validators.required, Validators.min(0.1)]],
        category: [null as Category | null, Validators.required],
        etat: [{ id: 1 } as any]
    });

    ngOnInit(): void {
        // 1) Charger listes
        this.categoryService.getCategories().subscribe(cats => this.categories = cats);
        this.etatService.getEtats().subscribe(list => this.etats = list);

        // 2) Déterminer le mode depuis l’URL (présence de :id)
        const idParam = this.route.snapshot.paramMap.get('id'); // plus fiable qu’attendre l’async
        this.isEditMode = !!idParam;

        if (this.isEditMode) {
            const id = Number(idParam);
            // Charger le produit (si ok => on passe bien en mode édition)
            this.http.get<Product>('product/' + id).subscribe(prod => {
                this.editedProduct = prod;
                this.form.patchValue(prod); // remplit aussi stock/category/etat si noms identiques
            });
        }
    }

    // Soumission (création). Si on est en édition, on redirige vers update.
    onAddProduct(): void {
        if (this.form.invalid) return;

        if (this.isEditMode && this.editedProduct) {
            this.onUpdateProduct();
            return;
        }

        const formData = new FormData();
        formData.set('product', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' }));
        if (this.photo) formData.set('photo', this.photo);

        this.http.post('product', formData).subscribe({
            next: () => { this.notify.show('Produit ajouté avec succès', 'valid'); this.router.navigateByUrl('equipments'); },
            error: () => this.notify.show('Erreur lors de l’ajout', 'error')
        });
    }

    // Modification (mise à jour)
    onUpdateProduct(): void {
        if (this.form.invalid || !this.editedProduct) return;

        this.productService.update(this.editedProduct.id, this.form.value).subscribe({
            next: () => { this.notify.show('Le produit a bien été modifié', 'valid'); this.router.navigateByUrl('equipments'); },
            error: () => this.notify.show('Problème de communication', 'error')
        });
    }

    // Pour <mat-select>
    compareId(a: { id: number } | null, b: { id: number } | null): boolean {
        return !!a && !!b && a.id === b.id;
    }

    onPhotoSelected(file: File | null): void { this.photo = file; }
}

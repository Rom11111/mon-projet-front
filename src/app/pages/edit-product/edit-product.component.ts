import {Component, inject} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotificationService} from '../../services/notification.service';

// ReactiveFormsModule utilisé pour valider le formulaire
// FormsModule bloque le formulaire pour ne pas recharger la page
@Component({
    selector: 'app-edit-product',
    imports: [MatInputModule, MatButtonModule, MatIconModule,
        MatSelectModule, ReactiveFormsModule, FormsModule],
    templateUrl: './edit-product.component.html',
    styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {

    formBuilder = inject(FormBuilder)
    http = inject(HttpClient)
    activatedRoute = inject(ActivatedRoute)
    notification =inject(NotificationService)

    form = this.formBuilder.group({
        name: ["Nouveau produit", [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
        // le nom est requis.
        code: ["1234", [Validators.required]],
        description: ["Une description", []],
        price: [15.99, [Validators.required, Validators.min(0.1)]],
        // Validators.min(0.1) le prix doit être d'au moins 10 centimes.
        etat: [{id: 1}],
        labelList: [[] as Label[]],
    })

    etats: Etat[] = []
    labels: Label[] = []
    editedProduct : Product | null = null;


    ngOnInit() {

        this.activatedRoute.params
            .subscribe(parameters => {
                // Si c'est une edition
                if (parameters['id']) {
                    this.http
                        .get<Product>('http://localhost:8080/product/' + parameters['id'])
                        .subscribe((product => {
                            this.form.patchValue(product)
                            this.editedProduct = product
                        }))

                }
            })

        this.http
            .get<Label[]>("http://localhost:8080/etats")
            .subscribe(etats => this.etats = etats)
        this.http
            .get<Label[]>("http://localhost:8080/labels")
            .subscribe(labels => this.labels = labels)

    }

    onAddProduct() {

        if (this.form.valid) {


            // pour éditer
            if(this.editedProduct)
                this.http
                    .put("http://localhost:8080/product" + this.editedProduct.id, this.form.value)
                    .subscribe(resultat => console.log(resultat))
            // gestion des notifications
                    this.notification.show("Produit modifié")
            } else {
            // pour un ajout
                this.http
                    .post("http://localhost:8080/product", this.form.value)
                    .subscribe(resultat => console.log(resultat))
                    this.notification.show("Produit ajouté", "valid")
        }
    }


    compareId(o1: { id: number }, o2: { id: number }) {

        return o1.id === o2.id;
    }
}

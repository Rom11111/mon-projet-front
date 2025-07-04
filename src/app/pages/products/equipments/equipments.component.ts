import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import {ProductService} from '../../../services/crud/product.service';
import {AuthService} from '../../../services/auth.service';

@Component({
    selector: 'app-equipments',
    templateUrl: './equipments.component.html',
    styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit {

    // Accès à l'enum UserRole dans le template
    readonly UserRole = UserRole;

    // Contiendra la liste des produits
    products: Product[] = [];

    // Pour injecter l'URL serveur dans le template
    environment = environment;

    constructor(
        public productService: ProductService,
        public auth: AuthService
    ) {}

    ngOnInit(): void {
        // Appel de l'API pour récupérer les produits au chargement
        this.productService.products$.subscribe(products => {
            this.products = products;
        });

        // Si la liste est vide, on déclenche le fetch
        this.productService.getAll();
    }

    // Méthode déclenchée quand un client clique sur "Louer"
    openRentalDialog(product: Product): void {
        console.log("Ouverture du dialogue de location pour :", product);
        // À compléter avec un MatDialog ou autre logique de location
    }
}

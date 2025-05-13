import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {RouterLink} from '@angular/router';
import {NgStyle} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {ProductService} from '../../services/crud/product.service';


@Component({
    selector: 'app-accueil',
    imports: [
        MatButtonModule, MatCardModule,
    ],
    templateUrl: './accueil.component.html',
    styleUrl: './accueil.component.scss'
})

export class AccueilComponent implements OnInit {


    auth = inject(AuthService)
    productService = inject(ProductService)
    products: Product[] = [];

    ngOnInit() {
        this.productService.getAll()

        this.productService.products$.subscribe(
            products => this.products = products)

    }
}

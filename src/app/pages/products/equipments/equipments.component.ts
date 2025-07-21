import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, CommonModule, NgOptimizedImage } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/crud/product.service';
import { Role } from '../../../models/role.enum';
import { environment } from '../../../../environments/environment';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import {NotificationService} from '../../../services/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../components/confirm-dialog/confirm-dialog.component';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {PageHeaderComponent} from '../../../components/page-header/page-header.component';

@Component({
    standalone: true,
    selector: 'app-equipments',
    templateUrl: './equipments.component.html',
    styleUrls: ['./equipments.component.scss'],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        RouterLink,
        CurrencyPipe,
        NgClass,
        MatCard,
        NgOptimizedImage,
        MatCheckbox,
        MatFormField,
        MatLabel,
        MatFormField,
        MatInput,
        MatLabel,
        MatFormField,
        PageHeaderComponent
    ]
})
export class EquipmentsComponent implements OnInit {
    // Colonnes du tableau (ordre d'affichage)
    displayedColumns: string[] = ['select', 'id', 'image', 'name', 'description', 'price', 'available', 'actions'];

    // Source des données du tableau
    dataSource = new MatTableDataSource<Product>();

    // Pour gérer la sélection multiple dans le tableau
    selection = new SelectionModel<Product>(true, []);

    // Flags pour gérer les droits utilisateurs
    isClient = false;
    isTechOrAdmin = false;

    // Références au paginator et tri Angular Material
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;


    constructor(
        private productService: ProductService,
        public auth: AuthService,
        private notification: NotificationService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Détection du rôle de l'utilisateur connecté
        const role = this.auth.role;
        this.isClient = role === Role.CLIENT;
        this.isTechOrAdmin = role === Role.TECH || role === Role.ADMIN;

        // Récupération des produits via le service
        this.productService.products$.subscribe(products => {
            this.dataSource.data = products;
        });

        // Appel initial pour peupler les données
        this.productService.getAll();

        // On branche le tri et la pagination une fois la vue prête
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }



    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Supprime un produit par son ID
     * Appelle le service puis rafraîchit la liste
     */
    deleteProduct(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirmation',
                message: 'Es-tu sûr de vouloir supprimer ce produit ?'
            },
            width: '400px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.productService.delete(id).subscribe(); // aucun message
            }
        });
    }

    /**
     * Ouvre une modale ou une action pour louer un produit
     */
    openRentalDialog(product: Product): void {
        console.log('Location demandée pour:', product);
        // À adapter selon ta modale/dialog ou redirection
    }

    // Pour gérer les images via env
    protected readonly environment = environment;


    getProductImageUrl(product: any): string {
        if (!product || !product.id) {
            return ''; // renvoyer une chaîne vide évite l’appel à `new URL(...)`
        }
        return `${environment.serverUrl}product/image/${product.id}`;
    }

    onImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'assets/images/default-product.png'; // chemin de l'image de fallback dans les assets
    }


    // --------- Gestion des checkboxes ---------

    /**
     * Vérifie si tous les produits sont sélectionnés
     */
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /**
     * Sélectionne ou désélectionne tout
     */
    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /**
     * Label dynamique utilisé par les cases à cocher
     * Utile pour l'accessibilité
     */
    checkboxLabel(row?: Product): string {
        if (!row) {
            return this.isAllSelected() ? 'Désélectionner tout' : 'Tout sélectionner';
        }
        return this.selection.isSelected(row)
            ? `Désélectionner produit ${row.id}`
            : `Sélectionner produit ${row.id}`;
    }
}

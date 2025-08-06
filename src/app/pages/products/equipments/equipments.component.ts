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
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {RentalDialogComponent} from '../../rental-dialog/rental-dialog.component';

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
        PageHeaderComponent,
        MatSlideToggle
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
        // Récupère directement le rôle sans préfixe
        const rawRole = this.auth.role;
        if (!rawRole) {
            console.warn('Aucun rôle trouvé pour l’utilisateur. Redirection ou affichage limité.');
            return;
        }
        const role = rawRole.replace('ROLE_', '') as Role;

        console.log('Rôle reçu :', rawRole);
        console.log('Rôle nettoyé :', role);

        // Mise à jour des flags
        this.isClient = role === Role.CLIENT;
        this.isTechOrAdmin = role === Role.TECH || role === Role.ADMIN;


        console.log('isClient :', this.isClient);
        console.log('isTechOrAdmin :', this.isTechOrAdmin);

        // Chargement des produits depuis l'api
        this.productService.products$.subscribe(products => {
            this.dataSource.data = products;
        });

        this.productService.getAll();

        // Initialisation du tri et de la pagination
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }



    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    isCurrentlyRented(product: Product): boolean {
        const etat = product.etat?.name?.toLowerCase();
        return etat === 'en cours' || etat === 'en retard';
    }

    onToggleAvailability(product: Product): void {
        // Si produit non dispo à la location (ex : il est déjà loué)
        if (this.isCurrentlyRented(product)) {
            this.notification.warning("Ce produit est actuellement loué et ne peut pas être désactivé.");
            return;
        }

        // Si on passe de dispo → indispo → on demande une confirmation
        if (product.available) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirmation',
                    message: `Es-tu sûr de vouloir rendre le produit "${product.name}" indisponible ?`,
                    confirmButtonText: 'Valider',         //  remplacement de "Supprimer"
                    cancelButtonText: 'Annuler'           //  texte explicite pour "Annuler"
                },
                width: '400px'
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.toggle(product);
                }
            });
        } else {
            this.toggle(product);
        }
    }

    private toggle(product: Product): void {
        this.productService.toggleAvailability(product.id).subscribe({
            next: (res) => {
                product.available = res.data.available;
            },
            error: () => {
                this.notification.error("Erreur lors de la mise à jour de disponibilité.");
            }
        });
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
        const dialogRef = this.dialog.open(RentalDialogComponent, {
            data: { product },
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.notification.success("Le produit a bien été ajouté à vos locations !");
                // Tu peux aussi rafraîchir la liste des produits ou naviguer si besoin
            }
        });
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

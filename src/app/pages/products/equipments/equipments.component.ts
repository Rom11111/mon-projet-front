import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonModule, CurrencyPipe, NgClass, NgOptimizedImage} from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { SelectionModel } from '@angular/cdk/collections';

import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { RentalDialogComponent } from '../../rental/rental-dialog/rental-dialog.component';

import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';

import { ProductService } from '../../../services/crud/product.service';
import { ExportService } from '../../../shared/export.service';

import { Product } from '../../../models/product';
import { Role } from '../../../models/role.enum';

import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import {
    UploadDocumentDialogComponent
} from '../../upload-download/upload-document-dialog/upload-document-dialog.component';
import {
    ViewDocumentsDialogComponent
} from '../../upload-download/view-documents-dialog/view-documents-dialog.component';
import {NotificationDialogComponent} from '../../../components/notification-dialog/notification-dialog.component';


@Component({
    standalone: true,
    selector: 'app-equipments',
    templateUrl: './equipments.component.html',
    styleUrls: ['./equipments.component.scss'],
    imports: [
        CommonModule,
        RouterLink,
        CurrencyPipe,
        NgClass,

        // Material
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatCard,
        MatCheckbox,
        MatFormField,
        MatInput,
        MatLabel,
        MatSlideToggle,
        MatTooltip,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        MatSelectModule,
        MatOptionModule,

        // Interne
        PageHeaderComponent,
        NgOptimizedImage,
    ]
})
export class EquipmentsComponent implements OnInit {

    // Colonnes du tableau
    displayedColumns: string[] = ['select','id','image','name','category','description','price','available','stock','actions'];

    // Source des données pour MatTable
    dataSource = new MatTableDataSource<Product & { imageUrl?: string }>();

    // Sélection multiple
    selection = new SelectionModel<Product>(true, []);

    // Rôles
    isClient = false;
    isTechOrAdmin = false;

    // Filtres
    globalFilter = '';                  // texte libre
    categories: Category[] = [];        // options du mat-select
    selectedCategoryIds: number[] = []; // ids sélectionnés

    // Map pour afficher le libellé de la catégorie depuis son id
    catMap = new Map<number, string>();

    // MatTable helpers
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private productService: ProductService,
        public auth: AuthService,
        private notification: NotificationService,
        private dialog: MatDialog,
        private exportService: ExportService,
        private categoryService: CategoryService
    ) {}

    ngOnInit(): void {
        // 1) Déterminer le rôle utilisateur (affiche/masque certaines colonnes et actions)
        const rawRole = this.auth.role;
        if (!rawRole) {
            console.warn('Aucun rôle trouvé pour l’utilisateur.');
            return;
        }
        const role = rawRole.replace('ROLE_', '') as Role;
        this.isClient = role === Role.CLIENT;
        this.isTechOrAdmin = role === Role.TECH || role === Role.ADMIN;

        this.displayedColumns = this.isTechOrAdmin
            ? ['select','id','image','name','category','description','price','available','stock','actions']
            : ['select','id','image','name','category','description','price','available','actions'];

        // 2) Charger les catégories et construire la map id -> libellé
        this.categoryService.getCategories().subscribe({
            next: (cats) => {
                this.categories = cats;                                  // alimente le filtre
                this.catMap = new Map(cats.map(c => [c.id, c.name]));    // lookup rapide
                this.dataSource._updateChangeSubscription();             // rafraîchit la vue
            },
            error: (err) => console.error('Erreur chargement catégories :', err)
        });

        // 3) Définir le filtre combiné (texte + catégories) une seule fois
        this.dataSource.filterPredicate = (row: Product, filterJson: string) => {
            const f = JSON.parse(filterJson || '{}') as { text?: string; categoryIds?: number[] };

            // a) Filtre texte sur name + description + price
            const txt = (f.text ?? '').toLowerCase().trim();
            const textOk = !txt
                ? true
                : (row.name?.toLowerCase().includes(txt)
                    || row.description?.toLowerCase().includes(txt)
                    || String(row.price ?? '').toLowerCase().includes(txt));

            // b) Filtre catégorie via id (prend categoryId si présent, sinon category?.id)
            const rowCatId = (row as any).categoryId ?? row.category?.id ?? null;
            const selected = f.categoryIds ?? [];
            const categoryOk = selected.length === 0 ? true : (rowCatId !== null && selected.includes(rowCatId));

            return textOk && categoryOk;
        };

        // 4) S’abonner aux produits
        //    On fabrique ici une URL d’image FIGÉE (avec cache-buster basé sur imageName)
        this.productService.products$.subscribe(products => {
            this.dataSource.data = products.map(p => ({
                ...p,
                // ⚠️ important : ne pas utiliser Date.now() ici
                // On utilise imageName : dès qu’elle change (après upload), l’URL change → le navigateur recharge la bonne image
                imageUrl: `product/image/${p.id}?t=${encodeURIComponent(p.imageName ?? '')}`
            }));

            // Applique le filtre actif (même si vide)
            this.applyCombinedFilter();
        });

        // 5) Premier chargement
        this.productService.getAll();

        // 6) Brancher paginator + sort une fois les ViewChild prêts
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    // === Helper d'affichage : nom de catégorie depuis id ===
    getCategoryName(p: any): string {
        const id = (p?.categoryId ?? p?.category?.id) as number | undefined;
        return id != null ? (this.catMap.get(id) ?? '—') : '—';
    }

    // === Filtre texte ===
    applyFilter(event: Event): void {
        this.globalFilter = (event.target as HTMLInputElement).value ?? '';
        this.applyCombinedFilter();
    }

    // === Filtre catégories ===
    onCategoryChange(ids: number[]): void {
        this.selectedCategoryIds = ids ?? [];
        this.applyCombinedFilter();
    }

    // Construit et applique l’objet de filtre attendu par MatTableDataSource
    private applyCombinedFilter(): void {
        const filter = {
            text: this.globalFilter,
            categoryIds: this.selectedCategoryIds
        };
        this.dataSource.filter = JSON.stringify(filter);

        // UX : revient en page 1 après filtrage
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }

    // === États & actions ===
    isCurrentlyRented(product: Product): boolean {
        const etat = product.etat?.name?.toLowerCase();
        return etat === 'en cours' || etat === 'en retard';
    }

    onToggleAvailability(product: Product): void {
        if (this.isCurrentlyRented(product)) {
            this.notification.warning('Ce produit est actuellement loué et ne peut pas être désactivé.');
            return;
        }
        if (product.available) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirmation',
                    message: `Rendre le produit "${product.name}" indisponible ?`,
                    confirmButtonText: 'Valider',
                    cancelButtonText: 'Annuler'
                },
                width: '400px'
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) this.toggle(product);
            });
        } else {
            this.toggle(product);
        }
    }

    private toggle(product: Product): void {
        this.productService.toggleAvailability(product.id).subscribe({
            next: (res) => { product.available = res.data.available; },
            error: () => { this.notification.error('Erreur lors de la mise à jour de disponibilité.'); }
        });
    }

    deleteProduct(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirmation', message: 'Supprimer ce produit ?' },
            width: '400px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) this.productService.delete(id).subscribe();
        });
    }

    openRentalDialog(product: Product, event?: Event): void {
        const dialogRef = this.dialog.open(RentalDialogComponent, { data: { product }, width: '500px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result === true) this.notification.success('Ajouté à vos locations !');
            if (event?.target instanceof HTMLElement) event.target.blur();
        });
    }

    onImageError(event: Event): void {
        (event.target as HTMLImageElement).src = 'assets/images/default-product.png';
    }

    // === Sélection ===
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach(row => this.selection.select(row));
    }

    checkboxLabel(row?: Product): string {
        if (!row) return this.isAllSelected() ? 'Désélectionner tout' : 'Tout sélectionner';
        return this.selection.isSelected(row) ? `Désélectionner produit ${row.id}` : `Sélectionner produit ${row.id}`;
    }

    onLouerClick(event: Event, product: Product): void {
        event.target instanceof HTMLElement && event.target.blur();
        this.openRentalDialog(product);
    }

    // === Export ===
    private getRowsForExport(): Product[] {
        if (this.selection.selected.length) return this.selection.selected;
        return this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data;
    }

    private mapForExport(rows: Product[]) {
        return rows.map(p => ({
            'ID': p.id,
            'Nom': p.name ?? '',
            'Catégorie': this.getCategoryName(p), // même libellé que l’affichage
            'Description': p.description ?? '',
            'Prix / jour (€)': p.price ?? '',
            'Disponibilité': p.available ? 'Disponible' : 'Indisponible',
            'Stock': p.stock ?? '',
        }));
    }

    async export(format: 'csv' | 'xlsx' | 'pdf') {
        const rows = this.getRowsForExport();
        const mapped = this.mapForExport(rows);
        if (format === 'csv') {
            this.exportService.exportCSV(mapped, 'equipements');
        } else if (format === 'xlsx') {
            await this.exportService.exportXLSX(mapped, 'equipements');
        } else {
            await this.exportService.exportPDF(mapped, 'equipements');
        }
    }

    openDocumentsDialog(productId: number): void {
        const dialogRef = this.dialog.open(ViewDocumentsDialogComponent, {
            width: '800px',
            data: productId
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.deleted) {
                this.dialog.open(NotificationDialogComponent, {
                    width: '400px',
                    data: {
                        title: 'Succès',
                        message: 'Document supprimé avec succès.',
                        type: 'valid'
                    }
                });
            }
        });
    }


    onUploadDocument(product: Product): void {
        const dialogRef = this.dialog.open(UploadDocumentDialogComponent, {
            width: '400px',
            data: product.id
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.notification.success('Document uploadé avec succès ✅');
            } else if (result === false) {
                this.notification.error('Erreur lors de l’upload du document');
            }
        });
    }
}

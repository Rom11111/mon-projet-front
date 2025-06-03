import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'; // Correction ici
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {Client} from '../../models/client';
import {ClientService} from '../../services/clients.service';
import {ProductService} from '../../services/crud/product.service';
import {Rental} from '../../models/rental';

@Component({
  selector: 'app-Rental',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    FormsModule
  ],
  templateUrl: './Rental.component.html',
  styleUrl: './Rental.component.scss'
})
export class RentalComponent implements OnInit {
  // ... le reste du code reste identique
    displayedColumns: string[] = ['id', 'client', 'productName', 'date', 'heureDebut', 'heureFin', 'statut', 'actions'];
    dataSource = new MatTableDataSource<Rental & { clientName: string, productName: string }>();
    clients: Client[] = [];

    constructor(
        private clientService: ClientService,
        private productService: ProductService
    ) {}

    ngOnInit() {
        // Charger les clients
        this.clientService.getClients().subscribe(clients => {
            this.clients = clients.filter(c => c.role === 'CLIENT');

            // Charger les produits via le BehaviorSubject existant
            this.productService.products$.subscribe(products => {
                // Enrichir les réservations avec les noms des clients et produits
                const enrichedRentals = this.Rentals.map(Rental => ({
                    ...Rental,
                    clientName: this.getClientFullName(Rental.clientId),
                    productName: this.getProductName(Rental.productId, products)
                }));

                this.dataSource.data = enrichedRentals;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

            // Déclencher le chargement des produits
            this.productService.getAll();
        });
    }

    getClientFullName(clientId: number): string {
        const client = this.clients.find(c => c.id === clientId);
        return client ? `${client.firstname} ${client.lastname}` : 'Client inconnu';
    }

    getProductName(productId: number, products: Product[]): string {
        const product = products.find(p => p.id === productId);
        return product ? product.name : 'Produit inconnu';
    }

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<Rental>;

    // Données de test
    Rentals: Rental[] = [
        {
            id: 1,
            clientId: 1,
            productId: 1,
            date: new Date('2024-03-20'),
            heureDebut: '09:00',
            heureFin: '10:30',
            statut: 'confirmé'
        },
        {
            id: 2,
            clientId: 2,
            productId: 2,
            date: new Date('2024-03-20'),
            heureDebut: '11:00',
            heureFin: '12:00',
            statut: 'en attente'
        },
        {
            id: 3,
            clientId: 1,
            productId: 3,
            date: new Date('2024-03-21'),
            heureDebut: '14:00',
            heureFin: '15:30',
            statut: 'annulé'
        }
    ];

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getStatutClass(statut: string): string {
        switch (statut) {
            case 'confirmé': return 'statut-confirme';
            case 'en attente': return 'statut-attente';
            case 'annulé': return 'statut-annule';
            default: return '';
        }
    }

    editRental(Rental: Rental) {
        console.log('Éditer réservation:', Rental);
        // Implémenter la logique d'édition
    }

    deleteRental(Rental: Rental) {
        console.log('Supprimer réservation:', Rental);
        // Implémenter la logique de suppression
    }
}

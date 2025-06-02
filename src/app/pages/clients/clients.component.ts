import { Component, OnInit, ViewChild } from '@angular/core';
import {
    MatCell, MatCellDef,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientService } from '../../services/clients.service';
import { Client } from '../../models/client';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import {ClientDetailsDialogComponent} from './client-details-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    imports: [
        MatTable,
        MatPaginator,
        MatFormField,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatInput,
        MatHeaderRow,
        MatRow,
        MatCellDef,
        MatRowDef,
        MatHeaderRowDef,
        MatHeaderCellDef,
        MatSort,
        MatIcon,
        MatIconButton,
        MatButton,
    ],
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    displayedColumns: string[] = ['firstname', 'lastname', 'company', 'email', 'actions'];
    dataSource = new MatTableDataSource<Client>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private clientService: ClientService,
                private dialog: MatDialog,
                private _snackBar: MatSnackBar

    ) {}


    onAdd(): void {
        this.dialog.open(ClientDetailsDialogComponent, {
            width: '500px',
            data: {} as Client
        });
    }

    onView(client: Client): void {
        this.dialog.open(ClientDetailsDialogComponent, {
            width: '500px',
            data: client
        });
    }

    onEdit(client: any): void {
        // Logique pour éditer un client
        console.log('Éditer client:', client);
    }

    onDelete(client: any): void {
        const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce client ?');

        if (confirmation) {
            this.clientService.deleteClient(client.id).pipe(
                catchError(error => {
                    console.error('Erreur lors de la suppression:', error);
                    return of(null);
                })
            ).subscribe(
                () => {
                    // Rafraîchir la liste des clients après suppression
                    this.loadClients();
                    // Message de confirmation
                    // Si vous utilisez Material Snackbar :
                    this._snackBar.open('Client supprimé avec succès', 'Fermer', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'bottom'
                    });
                }
            );
        }
    }


        ngOnInit() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            // Filtrer uniquement les clients
            this.dataSource.data = data.filter(c => c.role === 'CLIENT');
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

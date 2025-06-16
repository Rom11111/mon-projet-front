import { Component, OnInit, ViewChild } from '@angular/core';
import {
    MatCell, MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClientService } from '../../services/clients.service';

import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {Client} from '../../models/client';
import {Role} from '../../models/Role.enum';



@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    imports: [
        MatFormField,
        MatTable,
        MatInput,
        MatSort,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatPaginator,
        MatRow,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRowDef,
        MatFormField,
        MatSelect,
        MatOption,
        NgForOf,
        MatLabel,
        MatIcon
    ],
    styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
    displayedColumns: string[] = ['firstname', 'lastname', 'email', 'role'];
    dataSource = new MatTableDataSource<Client>();
    category = ['ADMIN', 'TECH'];
    selectedCategory : string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private clientService: ClientService) {}

    ngOnInit() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            // Filtrer uniquement les admins et techs
            this.dataSource.data = data.filter(c => c.role === Role.ADMIN || c.role === Role.TECH);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // Ajoute un filtre personnalisé pour la catégorie
            this.dataSource.filterPredicate = (data: Client, filter: string) => {
                if (!filter) return true;
                return data.role === filter;
            };
        });
    }

    // Méthode appelée lors du changement de catégorie
    applyCategoryFilter(category: string) {
        this.selectedCategory = category;
        this.dataSource.filter = category;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}

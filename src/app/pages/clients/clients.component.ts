import { Component, OnInit } from '@angular/core';

import {ClientService} from '../../services/clients.service'; // Mise à jour du chemin
import {Client} from '../../models/client';

import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button'; // Importation de l'interface depuis models
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatCard,
        MatFormField,
        MatInput,
        MatLabel,
        FormsModule,
        MatFormField,
        NgForOf,
        MatButton,
        MatOption,
        MatSelect
    ],
    styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
    search = '';
    clients: Client[] = [];
    selectedClient: Client | null = null;

    roleFilter: string = '';
    sortOrder: 'asc' | 'desc' = 'asc';

    constructor(private clientService: ClientService) {}

    ngOnInit() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.clients = data.map((c, i) => ({
                ...c,
                photoUrl: `https://i.pravatar.cc/100?img=${i + 1}`,
                status: i % 2 === 0 ? 'Active' : 'Inactive'  // Pour l'exemple
            }));
        });
    }

    // Retourne les clients filtrés et triés
    get filteredAndSortedClients() {
        let filteredClients = this.clients.filter(client => {
            const matchesSearch = client.firstname.toLowerCase().includes(this.search.toLowerCase()) ||
                client.lastname.toLowerCase().includes(this.search.toLowerCase());
            const matchesRole = this.roleFilter ? client.role === this.roleFilter : true;
            return matchesSearch && matchesRole;
        });

        // Tri des clients, avec les admins en premier
        if (this.sortOrder === 'asc') {
            filteredClients.sort((a, b) => {
                if (a.role === 'ADMIN' && b.role !== 'ADMIN') {
                    return -1; // Placer les admins en premier
                } else if (a.role !== 'ADMIN' && b.role === 'ADMIN') {
                    return 1;
                }
                return a.lastname.localeCompare(b.lastname); // Tri par nom
            });
        } else {
            filteredClients.sort((a, b) => {
                if (a.role === 'ADMIN' && b.role !== 'ADMIN') {
                    return -1; // Placer les admins en premier
                } else if (a.role !== 'ADMIN' && b.role === 'ADMIN') {
                    return 1;
                }
                return b.lastname.localeCompare(a.lastname); // Tri inverse par nom
            });
        }

        return filteredClients;
    }

    selectClient(client: Client) {
        this.selectedClient = client;
    }

    closeDetails() {
        this.selectedClient = null;
    }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {environment} from '../../environments/environment';
import {Client} from '../models/client';  // Importation depuis le dossier models

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    constructor(private http: HttpClient) {}

    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>('/api/clients');  // Récupération des utilisateurs
    }

    deleteClient(id: number): Observable<any> {
        return this.http.delete(`/api/clients/${id}`);
    }

}

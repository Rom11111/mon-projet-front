import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../models/user';


@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = 'users/me';

    constructor(private http: HttpClient) {}

    getCurrentUser(): Observable<User> {
        return this.http.get<User>(this.apiUrl);
    }

    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>('users'); // va appeler /api/users
    }

}

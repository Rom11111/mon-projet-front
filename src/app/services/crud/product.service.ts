import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, of, tap, throwError, Observable} from 'rxjs';
import {NotificationService} from '../notification.service';
import {environment} from '../../../environments/environment';

//import any = jasmine.any;

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    http = inject(HttpClient)
    notification = inject(NotificationService)
    readonly products$ = new BehaviorSubject<Product[]>([])

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(`${environment.serverUrl}/products`);
    }

    save(product: any) {
        return this.http.post("environment.serverUrl +/product", product).pipe(
            tap(() => this.getAll()),
            catchError(error => {
                // Handle the error if needed
                return throwError(error);
            })
        );
    }

    update(id: number, product: any) {

        return this.http.put("environment.serverUrl +/product/" + id, product).pipe(
            tap(() => this.getAll()),
            catchError(error => {
                // Handle the error if needed
                return throwError(error);
            })
        );
    }


}

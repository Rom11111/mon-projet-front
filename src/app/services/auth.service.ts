import { Injectable } from '@angular/core';
import {J} from '@angular/cdk/keycodes';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    connected = false
    role: string | null = null

    constructor() {
        const jwt = localStorage.getItem("jwt")
        if (jwt != null) {
            this.decodeJwt(jwt)
        }
    }
        decodeJwt(jwt: string){
            localStorage.setItem("jwt", jwt)

            // On découpe le jwt en 3 parties séparées par un point
            const splitJwt = jwt.split(".");
            // On récupère la partie "body du jwt
            const jwtBody = splitJwt[1]
            // On décode la base 64
            const jsonBody = atob(jwtBody)
            // On transforme le json en objet js
            const body = JSON.parse(jsonBody)


            this.role = body.role;

            this.connected = true

        }

        signOut(){
            localStorage.removeItem("jwt")
            this.connected = false
            this.role = null
        }
}

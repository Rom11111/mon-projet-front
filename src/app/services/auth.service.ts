import {Injectable} from '@angular/core';

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

    decodeJwt(jwt: string) {
        localStorage.setItem("jwt", jwt)

        //on decoupe le jwt en 3 parties séparées par un point
        const splitJwt = jwt.split(".");
        //on recupere la partie "body" du jwt
        const jwtBody = splitJwt[1]
        //on decode la base 64
        const jsonBody = atob(jwtBody)
        //on transforme le json en objet js
        const body = JSON.parse(jsonBody)

        this.role = body.role;

        this.connected = true;
    }

    logout() {
        localStorage.removeItem("jwt")
        this.connected = false
        this.role = null
    }

}

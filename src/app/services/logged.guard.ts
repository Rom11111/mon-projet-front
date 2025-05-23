import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const loggedGuard: CanActivateFn = (route, state) => {
    const  jwt = localStorage.getItem("jwt")

    if(jwt == null) {

        const router: Router = inject(Router);

        return router.parseUrl('/login')
    }
    return true;
};

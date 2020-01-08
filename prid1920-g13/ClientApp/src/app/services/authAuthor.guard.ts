import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Http2ServerRequest } from 'http2';
@Injectable({ providedIn: 'root' })
export class AuthGuardAuthor implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,

    ) { }
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        const currentUser = this.authenticationService.currentUser;
        if (currentUser) {
            // check if current user is author
            const id = route.paramMap.get('id');
            var isAuthor = await this.authenticationService.isAuthor(id).toPromise();
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1 && !isAuthor) {
                // role not authorised so redirect to home page
                this.router.navigate(['/restricted']);
                return false;
            }
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
        
    }

}
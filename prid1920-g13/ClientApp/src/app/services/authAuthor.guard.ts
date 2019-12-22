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
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
        const id = route.paramMap.get('id');
        
        return this.authenticationService.isAuthor(id);
    }

}
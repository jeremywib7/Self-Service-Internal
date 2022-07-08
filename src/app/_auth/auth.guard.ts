import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserAuthService} from "../service/user-auth.service";
import {UserService} from "../service/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private userAuthService: UserAuthService, private router: Router, private userService: UserService) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.userAuthService.getToken() != null) {
            const allowedRole = route.data['roles'] as Array<string>;
            let isMatch;

            allowedRole.forEach(role => {
                const match = this.userService.roleMatch(role);

                if (match) {
                    isMatch = true;
                }
            });

            if (isMatch) {
                return true;
            } else {
                this.router.navigate(['pages/access']);
                return false;
            }
        }
        this.router.navigate(['pages/login']);
        return false;
    }

}

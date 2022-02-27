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

    let currentRole;
    if (this.userAuthService.getToken() != null) {
      const allowedRole = route.data['roles'] as Array<string>;

      if (allowedRole) {
        const match = this.userService.roleMatch(allowedRole);
        if (match) {
          return true;
        } else {
          currentRole = this.userAuthService.getRoles()

          if (currentRole.length === 0) {
            this.router.navigate(['/login']);
          } else {

            if (this.userAuthService.getRoles() === "Customer") {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/forbidden']);
            }
          }

          return false;
        }
      } else {

      }
    }
    this.router.navigate(['/login']);
    return false;
  }

}

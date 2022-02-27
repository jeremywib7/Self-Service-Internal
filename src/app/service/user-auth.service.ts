import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  secretKey = "nih71h8dh1j2spaksnjabx1092k1osom1inu1b27y17u2e9109io1ksoj2ih1udubfkkvk12j819291kd00k[pkajkncwniq";

  constructor() {
  }

  public setRoles(roles: []) {
    localStorage.setItem('_security_role', JSON.stringify(roles['roleName'].toString())
    );
  }

  public getRoles() {
    return JSON.parse(
      localStorage.getItem('_security_role'));
  }

  public setToken(accessToken: string) {
    localStorage.setItem('_security_accessToken',
      JSON.stringify(accessToken)
    );
  }

  public getToken() {
    return JSON.parse(localStorage.getItem('_security_accessToken'));
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

}

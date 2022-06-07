import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    public secretKey = "o9szYIOq1rRMiouNhNvaq96lqUvCekxR";

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

    public getUsername() {
        return JSON.parse(
            localStorage.getItem('_security_username'));
    }

    public setUsername(username: string) {
        localStorage.setItem('_security_username', JSON.stringify(username));
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

import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserAuthService} from "./auth-service/user-auth.service";
import {environment} from "../../environments/environment";
import {lastValueFrom, Observable, of, switchMap} from "rxjs";
import {User} from "../model/User";
import {ChangePasswordInterface} from "../model/auth/interface/ChangePassword.interface";
import {ChangePasswordForm} from "../model/auth/form/ChangePassword.form";

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnInit {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    requestHeader = new HttpHeaders(
        {"No-Auth": "True"}
    );

    constructor(private httpClient: HttpClient, private userAuthService: UserAuthService,) {
    }

    ngOnInit(): void {
    }

    public checkJWTExpiry(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/checkJWT`, {
            params, headers: this.requestHeader
        });
    }

    public login(loginData: any) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/authenticate`,
            loginData, {headers: this.requestHeader});
    }

    public changePassword(changePassword: ChangePasswordForm) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/user/change/password`, changePassword);
    }

    public addUser(user: User): Observable<User> {
        return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/user/register`, user);
    }

    public updateUser(user: User): Observable<User> {
        return this.httpClient.put<User>(`${this.apiServerUrl}/${this.project}/user/update`, user);
    }

    public uploadImageFile(selectedFile: File, id: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', selectedFile);

        let params = new HttpParams();
        params = params.append('id', id);

        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/user/upload/`, formData,
            {params});
    }

    public deleteUser(username: string): Observable<User> {
        return this.httpClient.delete<User>(`${this.apiServerUrl}/${this.project}/user/delete/${username}`);
    }

    public resetUserPassword(username: string) {
        let params = new HttpParams().append("username", username);
        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/user/reset/password`, null, {
            params: params
        });
    }

    public deleteSelectedUsers(params: HttpParams): Observable<User> {
        return this.httpClient.delete<User>(`${this.apiServerUrl}/${this.project}/user/delete/selected`, {params});
    }

    public getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.apiServerUrl}/${this.project}/user/all`);
    }

    public getUserByUsername(params: HttpParams): Observable<User> {
        return this.httpClient.get<User>(`${this.apiServerUrl}/${this.project}/user/find`, {params: params});
    }

    public forUser() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/selfservice/forUser`, {
            responseType: 'text',
        });
    }

    public forAdmin() {
        return this.httpClient.get(this.apiServerUrl + '/forAdmin', {responseType: 'text'});
    }

    // @ts-ignore
    public roleMatch(allowedRoles): boolean {
        let isMatch = false;
        const userRoles: any = this.userAuthService.getRoles();

        if (userRoles != null && userRoles) {

            if (userRoles.toString() === allowedRoles.toString() || allowedRoles.toString() === "All") {
                isMatch = true;
            } else {
                isMatch = false;
            }
            return isMatch;
        }
    }
}

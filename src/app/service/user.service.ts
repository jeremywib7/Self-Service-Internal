import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserAuthService} from "./user-auth.service";
import {environment} from "../../environments/environment";
import {lastValueFrom, Observable, of, switchMap} from "rxjs";
import {User} from "../model/User";

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

    public addUser(user: User): Observable<User> {
        return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/user/register`, user);
    }

    public updateUser(user: User): Observable<User> {
        return this.httpClient.put<User>(`${this.apiServerUrl}/${this.project}/user/update`, user);
    }


    // public addOrUpdateUser(user: User, mode: string, selectedImage?: File) : Observable<User> {
    //
    //     if (selectedImage) {
    //         //get file extension
    //         const ext = selectedImage.type.replace('image/', '');
    //
    //         if (mode === "edit") {
    //              return this.httpClient.put<User>(`${this.apiServerUrl}/${this.project}/user/update`, user);
    //         }
    //
    //         if (mode !== "edit") {
    //             return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/user/register`, user);
    //         }
    //
    //         // const formData: FormData = new FormData();
    //         // formData.append('file', selectedImage);
    //         //
    //         // let params = new HttpParams();
    //         // params = params.append('userId', user.id);
    //         //
    //         // await lastValueFrom(this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/user/upload/`, formData,
    //         //     {params})).then();
    //
    //         // observable = observable.pipe(
    //         //     switchMap(() => {
    //         //         if (mode === "edit") {
    //         //             return this.httpClient.put<User>(`${this.apiServerUrl}/${this.project}/user/update`, user);
    //         //         } else {
    //         //             return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/user/register`, user);
    //         //         }
    //         //     })
    //         // );
    //
    //         // observable.pipe(
    //         //     switchMap(() => {
    //         //         // user.imageUrl = user.username + ext;
    //         //
    //         //         const formData: FormData = new FormData();
    //         //         formData.append('file', selectedImage);
    //         //
    //         //         let params = new HttpParams();
    //         //         params = params.append('userId', user.id);
    //         //
    //         //         return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/user/upload/`, formData,
    //         //             {params});
    //         //     })
    //         // )
    //
    //
    //         // observable = observable.pipe(
    //         //     switchMap(() => {
    //         //         // user.imageUrl = user.username + ext;
    //         //
    //         //         const formData: FormData = new FormData();
    //         //         formData.append('file', selectedImage);
    //         //
    //         //         let params = new HttpParams();
    //         //         params = params.append('userId', user.id);
    //         //
    //         //         return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/user/upload/`, formData,
    //         //             {params});
    //         //     })
    //         // )
    //     }
    //
    //     // return observable.pipe(
    //     //     switchMap(() => {
    //     //         if (mode === "edit") {
    //     //             return this.httpClient.put<User>(`${this.apiServerUrl}/${this.project}/user/update`, user);
    //     //         } else {
    //     //             return this.httpClient.post<User>(`${this.apiServerUrl}/${this.project}/user/register`, user);
    //     //         }
    //     //     })
    //     // );
    //
    // }

    public uploadImageFile(selectedFile: File, id: string) : Observable<any> {
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

    public deleteSelectedUsers(params: HttpParams): Observable<User> {
        return this.httpClient.delete<User>(`${this.apiServerUrl}/${this.project}/user/delete/selected`, {params});
    }

    public getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${this.apiServerUrl}/${this.project}/user/all`);
    }

    public getUserByUsername(username: string): Observable<User> {
        return this.httpClient.get<User>(`${this.apiServerUrl}/${this.project}/user/find/${username}`);
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

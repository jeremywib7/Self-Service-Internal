import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User";
import {environment} from "../../environments/environment";
import {Dashboard} from "../model/Dashboard";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(private httpClient: HttpClient) {
    }

    public loadDashboardData(): Observable<any> {
        return this.httpClient.get<any>(`${this.apiServerUrl}/${this.project}/dashboard`);
    }
}

import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../../model/User";
import {FormGroup} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class QnaService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    qnaForm: FormGroup;

    constructor(private readonly httpClient: HttpClient) {
    }

    public getAllQna() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/qna`);
    }
}

import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {Qna} from "../models/qna";
import {FormBuilderConfiguration, RxFormBuilder} from "@rxweb/reactive-form-validators";
import {HttpResponse} from "../../../model/util/HttpResponse";
import {Observable} from "rxjs";

@Injectable()
export class QnaService {
    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    qnaForm: FormGroup;

    constructor(
        private httpClient: HttpClient,
        private fb: RxFormBuilder
    ) {
        let qnaList = new Qna();
        this.qnaForm = this.fb.formGroup(qnaList, new FormBuilderConfiguration({
            baseAbstractControlOptions: {
                answer: {
                    updateOn: 'blur'
                }
                // global: {
                //     updateOn: 'blur'
                // }
            }
        }))
    }

    public getAllQna(): Observable<HttpResponse> {
        return this.httpClient.get<HttpResponse>(`${this.apiServerUrl}/${this.project}/v1/qna/find-all`);
    }

    public addQna(qna: Qna): Observable<HttpResponse> {
        return this.httpClient.post<HttpResponse>(`${this.apiServerUrl}/${this.project}/v1/qna/add`, qna);
    }

    public updateQna(qna: Qna): Observable<HttpResponse> {
        return this.httpClient.put<HttpResponse>(`${this.apiServerUrl}/${this.project}/v1/qna/update`, qna);
    }

    public deleteQna(id: string): Observable<HttpResponse> {
        let params = new HttpParams().append("id",id);
        return this.httpClient.delete<HttpResponse>(`${this.apiServerUrl}/${this.project}/v1/qna/delete`,
            {params: params});
    }
}

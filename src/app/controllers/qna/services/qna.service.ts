import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, FormGroup} from "@angular/forms";
import {QnaList} from "../models/qna-list";
import {FormBuilderConfiguration, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
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
        let qnaList = new QnaList();
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
}

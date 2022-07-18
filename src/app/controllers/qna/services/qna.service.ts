import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {QnaList} from "../models/qna-list";
import {FormBuilderConfiguration, RxFormBuilder} from "@rxweb/reactive-form-validators";

@Injectable()
export class QnaService {
    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    qnaForm: FormGroup;

    qnaList: QnaList[] = [];

    isTableQnaLoading: boolean = false;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly fb: RxFormBuilder
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

    public getAllQna() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/qna`);
    }
}

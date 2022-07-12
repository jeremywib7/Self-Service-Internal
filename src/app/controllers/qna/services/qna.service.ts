import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../../model/User";
import {FormBuilder, FormGroup} from "@angular/forms";
import {QnaList} from "../../../model/QnaList";
import {NumericValueType, RxwebValidators} from "@rxweb/reactive-form-validators";

@Injectable({
    providedIn: 'root'
})
export class QnaService {
    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    qnaForm: FormGroup;

    qnaList: QnaList[] = [];

    isTableQnaLoading: boolean = false;

    constructor(
        private readonly httpClient: HttpClient,
        private readonly fb: FormBuilder
    ) {
        this.qnaForm = this.fb.group({
            id: [''],
            number: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            answer: ['', [RxwebValidators.required()]],
            question: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            createdOn: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            updatedOn: ['',
                [
                    RxwebValidators.required(),
                ]
            ]
        });

    }

    public getAllQna() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/qna`);
    }
}

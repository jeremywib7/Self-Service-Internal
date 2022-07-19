import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, ɵTypedOrUntyped} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {environment} from "../../../../environments/environment";
import {firstValueFrom} from "rxjs";
import {HttpResponse} from "../../../model/util/HttpResponse";
import {QnaList} from "../models/qna-list";

@Component({
    selector: 'app-qna',
    templateUrl: './qna.component.html',
    styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    showAddOrEditQnaDialog: boolean = false;

    editMode: boolean = false;

    qnaCo: any; //qnaForm.controls

    qnaList: QnaList[] = [];

    isTableQnaLoading: boolean = false;

    qnaForm: FormGroup;

    constructor(
        public qnaService: QnaService,
    ) {
        this.qnaForm = this.qnaService.qnaForm;
        this.qnaCo = this.qnaForm.controls;
    }

    async ngOnInit(): Promise<void> {
        await this.getAllQna();
    }

    async getAllQna() {
        const res: HttpResponse = await firstValueFrom(this.qnaService.getAllQna());
        console.log(res);
    }

    onSort(event) {

    }

    onFilter(event) {
        console.log(event);
    }

    onReset() {
        this.qnaForm.reset();
        this.qnaForm.markAsPristine();
        this.qnaForm.markAsUntouched();
    }

    onAddQnaDialog() {
        this.showAddOrEditQnaDialog = true;
    }

    onEditQnaDialog() {

    }

    onQnaRowReorder() {

    }

    async submit() {
        console.log(this.qnaForm.value);

        if (this.editMode) {

        }
    }

}

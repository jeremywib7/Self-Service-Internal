import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, ɵTypedOrUntyped} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {environment} from "../../../../environments/environment";
import {firstValueFrom} from "rxjs";
import {HttpResponse} from "../../../model/util/HttpResponse";
import {Qna} from "../models/qna";
import {Pagination} from "../../../model/util/Pagination";
import {ConfirmationService, MessageService} from "primeng/api";
import {FormService} from "../../../service/form.service";

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

    qnaList: Qna[] = [];

    isTableQnaLoading: boolean = false;

    qnaForm: FormGroup;

    constructor(
        public qnaService: QnaService,
        private formService: FormService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {
        this.qnaForm = this.qnaService.qnaForm;
        this.qnaCo = this.qnaForm.controls;
    }

    async ngOnInit(): Promise<void> {
        await this.getAllQna();
    }

    async getAllQna() {
        const res: HttpResponse = await firstValueFrom(this.qnaService.getAllQna());
        const data: Pagination = res.data;
        this.qnaList = data.content;
        console.log(this.qnaList);
        // console.log(data.content);
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
        this.editMode = false;
    }

    onEditQnaDialog() {
        this.showAddOrEditQnaDialog = true;
        this.editMode = true;
    }

    onDeleteQnaDialog(id: string) {
        this.confirmationService.confirm({
            message: "Confirm delete QnA ?",
            icon: "pi pi-trash",
            header: `Delete Qna`,
            accept: async () => {
                await firstValueFrom(this.qnaService.deleteQna(id));
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product successfully added'
                });
            },
        });
    }

    onQnaRowReorder() {

    }

    async submit() {
        if (this.editMode) {
            await firstValueFrom(this.qnaService.updateQna(this.qnaForm.value));
        } else {
            await firstValueFrom(this.qnaService.addQna(this.qnaForm.value));
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Qna successfully ${this.editMode ? 'updated' : 'added'}`
        });
    }

}

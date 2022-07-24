import {Component, ElementRef, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, ɵTypedOrUntyped} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {environment} from "../../../../environments/environment";
import {firstValueFrom} from "rxjs";
import {HttpResponse} from "../../../model/util/HttpResponse";
import {Qna} from "../models/qna";
import {Pagination} from "../../../model/util/Pagination";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";
import {FormService} from "../../../service/helper-service/form.service";
import {ReactiveFormConfig} from "@rxweb/reactive-form-validators";
import {DatePipe, TitleCasePipe} from "@angular/common";
import {HttpParams} from "@angular/common/http";
import {TableLazyService} from "../../../service/helper-service/table-lazy.service";
import {TableColumn} from "../../../model/util/TableColumn";

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


    isTableQnaLoading: boolean = true;

    qnaForm: FormGroup;

    constructor(
        public qnaService: QnaService,
        public formService: FormService,
        public titleCasePipe: TitleCasePipe,
        private tableLazyService: TableLazyService,
        private confirmationService: ConfirmationService,
        private el: ElementRef,
        public datePipe: DatePipe,
        private messageService: MessageService,
    ) {
        this.qnaForm = this.qnaService.qnaForm;
        this.qnaCo = this.qnaForm.controls;
    }

    async ngOnInit(): Promise<void> {
        await this.getAllQnaOnInit();
    }

    async getAllQnaOnInit() {
        const res = await firstValueFrom(this.qnaService.getAllQna()).catch(() => {
            this.isTableQnaLoading = false;
        });
        this.setTableData(res);
    }

    async onFilter(lazyLoadEvent: LazyLoadEvent) {
        this.isTableQnaLoading = true;
        const res = await firstValueFrom(this.qnaService.getAllQna(lazyLoadEvent)).catch(() => {
            this.isTableQnaLoading = false;
        });
        this.setTableData(res);
    }

    onBlur() {
        console.log("test");
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

    onEditQnaDialog(qna: Qna) {
        this.showAddOrEditQnaDialog = true;
        this.editMode = true;
        this.qnaForm.patchValue(qna);
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
                let index = this.qnaList.findIndex(qna => qna.id === id);
                this.qnaList.splice(index, 1);
            }
        });
    }

    onQnaRowReorder() {

    }

    setTableData(res) {
        const httpResponse = res as HttpResponse;
        const data: Pagination = httpResponse.data;
        this.qnaList = data.content;
        this.isTableQnaLoading = false;
    }

    async submit() {
        if (this.qnaForm.invalid) {
            return this.formService.validateFormFields(this.qnaForm, this.el);
        }

        // set all field to uppercase
        let question = this.qnaForm.get('question').value;
        this.qnaForm.get('question').setValue(this.titleCasePipe.transform(question));

        let answer = this.qnaForm.get('answer').value;
        this.qnaForm.get('answer').setValue(this.titleCasePipe.transform(answer));

        if (this.editMode) {
            const res = await firstValueFrom(this.qnaService.updateQna(this.qnaForm.value)).catch(() => {
                this.formService.validateFormFields(this.qnaForm, this.el);
                this.qnaForm.get('question').setErrors({'qnaQuestionExists': true});
            });
            const httpRes = res as HttpResponse;
            let index = this.qnaList.findIndex(qna => qna.id === this.qnaForm.get('id').value);
            this.qnaList[index] = httpRes.data;
        } else {
            const res = await firstValueFrom(this.qnaService.addQna(this.qnaForm.value)).catch(() => {
                this.formService.validateFormFields(this.qnaForm, this.el);
                this.qnaForm.get('question').setErrors({'qnaQuestionExists': true});
            });
            const httpRes = res as HttpResponse;
            this.qnaList.push(httpRes.data);
        }
        this.showAddOrEditQnaDialog = false;
        this.qnaForm.reset();
        return this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Qna successfully ${this.editMode ? 'updated' : 'added'}`
        });
    }
}

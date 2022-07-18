import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {environment} from "../../../../environments/environment";
import {FormGroupExtension, RxFormGroup} from '@rxweb/reactive-form-validators';

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

    qnaForm: FormGroup;

    constructor(
        public qnaService: QnaService,
    ) {
        this.qnaForm = this.qnaService.qnaForm;
    }

    ngOnInit(): void {
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

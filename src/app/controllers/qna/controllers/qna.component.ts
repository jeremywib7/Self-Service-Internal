import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {QnaList} from "../../../model/QnaList";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-qna',
    templateUrl: './qna.component.html',
    styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    text: string;

    showAddOrEditQnaDialog: boolean = false;

    editMode: boolean = false;

    constructor(public readonly qnaService: QnaService) {
    }

    ngOnInit(): void {
    }

    onSort(event) {

    }

    onFilter(event) {
        console.log(event);
    }

    onAddQnaDialog() {
        this.showAddOrEditQnaDialog = true;
    }

    onEditQnaDialog() {

    }

    onQnaRowReorder() {

    }

    async submit() {
        if (this.editMode) {

        }
    }

}

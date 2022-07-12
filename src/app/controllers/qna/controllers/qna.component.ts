import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QnaService} from "../services/qna.service";
import {QnaList} from "../../../model/QnaList";

@Component({
    selector: 'app-qna',
    templateUrl: './qna.component.html',
    styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {

    text: string;


    constructor(public readonly qnaService: QnaService) {
    }

    ngOnInit(): void {
    }

    openAddQnaDialog() {

    }

    onQnaRowReorder() {

    }

}

import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QnaService} from "../services/qna.service";

@Component({
    selector: 'app-qna',
    templateUrl: './qna.component.html',
    styleUrls: ['./qna.component.scss']
})
export class QnaComponent implements OnInit {

    text: string;

    constructor(private readonly qnaService: QnaService) {
    }

    ngOnInit(): void {
    }

}

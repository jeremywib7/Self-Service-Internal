import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QnaComponent} from './controllers/qna.component';
import {QnaService} from "./services/qna.service";

@NgModule({
    declarations: [
        QnaComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        QnaService
    ]
})
export class QnaModule {
}

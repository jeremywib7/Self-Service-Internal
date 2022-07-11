import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QnaComponent} from './controllers/qna.component';
import {QnaService} from "./services/qna.service";
import {QnaRoutingModule} from "./qna-routing.module";
import {EditorModule} from "primeng/editor";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        QnaComponent,
    ],
    imports: [
        CommonModule,
        QnaRoutingModule,
        EditorModule,
        FormsModule,
    ],
    providers: [
        QnaService
    ],
})
export class QnaModule {
}

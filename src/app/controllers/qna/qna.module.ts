import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QnaComponent} from './controllers/qna.component';
import {QnaService} from "./services/qna.service";
import {QnaRoutingModule} from "./qna-routing.module";
import {EditorModule} from "primeng/editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {CalendarModule} from "primeng/calendar";
import {DialogModule} from "primeng/dialog";
import {LazyLoadImageModule} from "ng-lazyload-image";

@NgModule({
    declarations: [
        QnaComponent,
    ],
    imports: [
        CommonModule,
        QnaRoutingModule,
        EditorModule,
        FormsModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        TableModule,
        InputTextModule,
        CalendarModule,
        DialogModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
    ],
    providers: [
        QnaService
    ],
})
export class QnaModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QnaComponent} from './controllers/qna.component';
import {QnaService} from "./services/qna.service";
import {BreadcrumbModule} from "xng-breadcrumb";
import {AuthGuard} from "../../_auth/auth.guard";
import {MenuService} from "../../service/app.menu.service";
import {RouterModule} from "@angular/router";
import {MenusComponent} from "../../components/menus/menus.component";
import {PersonalComponent} from "../../components/menus/personal.component";
import {ConfirmationComponent} from "../../components/menus/confirmation.component";
import {SeatComponent} from "../../components/menus/seat.component";
import {PaymentComponent} from "../../components/menus/payment.component";
import {QnaRoutingModule} from "./qna-routing.module";
import {AppModule} from "../../app.module";
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        QnaComponent,
    ],
    imports: [
        CommonModule,
        QnaRoutingModule,
    ],
    providers: [
        QnaService
    ],
})
export class QnaModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {QnaComponent} from "./controllers/qna.component";

const routes: Routes = [
    {
        path: '',
        data: {
            breadcrumb: 'QnA',
        },
        component: QnaComponent,
        children: [
            {
                path: 'add',
                component: QnaComponent,
                data: {breadcrumb: 'New'},
            },
        ]
    },
    {
        path: '**',
        data: {
            breadcrumb: 'QnA',
        },
        redirectTo: '',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QnaRoutingModule {
}

import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormLayoutComponent} from './components/formlayout/formlayout.component';
import {PanelsComponent} from './components/panels/panels.component';
import {OverlaysComponent} from './components/overlays/overlays.component';
import {MediaComponent} from './components/media/media.component';
import {MessagesComponent} from './components/messages/messages.component';
import {MiscComponent} from './components/misc/misc.component';
import {EmptyComponent} from './components/empty/empty.component';
import {ChartsComponent} from './components/charts/charts.component';
import {FileComponent} from './components/file/file.component';
import {DocumentationComponent} from './components/documentation/documentation.component';
import {AppMainComponent} from './app.main.component';
import {InputComponent} from './components/input/input.component';
import {ButtonComponent} from './components/button/button.component';
import {TableComponent} from './components/table/table.component';
import {ListComponent} from './components/list/list.component';
import {TreeComponent} from './components/tree/tree.component';
import {CrudComponent} from './components/crud/crud.component';
import {BlocksComponent} from './components/blocks/blocks.component';
import {FloatLabelComponent} from './components/floatlabel/floatlabel.component';
import {InvalidStateComponent} from './components/invalidstate/invalidstate.component';
import {TimelineComponent} from './components/timeline/timeline.component';
import {IconsComponent} from './components/icons/icons.component';
import {LandingComponent} from './components/landing/landing.component';
import {ErrorComponent} from './components/error/error.component';
import {NotfoundComponent} from './components/notfound/notfound.component';
import {AccessComponent} from './components/access/access.component';
import {ProductComponent} from "./controllers/product/product.component";
import {UserComponent} from "./controllers/user/user.component";
import {LoginComponent} from "./controllers/login/login.component";
import {ProductFormComponent} from "./controllers/product/Form/product-form/product-form.component";
import {PaymentComponent} from "./controllers/payment/payment.component";
import {ProductCategoryComponent} from "./controllers/product/product-category/product-category.component";
import {WaitingListComponent} from "./controllers/waiting-list/waiting-list.component";
import {SalesReportComponent} from "./controllers/sales-report/sales-report.component";
import {ProfileComponent} from "./controllers/profile/profile.component";
import {DashboardComponent} from "./controllers/dashboard/dashboard.component";
import {AuthGuard} from "./_auth/auth.guard";
import {ProductDetailComponent} from "./controllers/product/Steps/product-detail/product-detail.component";
import {ProductPriceComponent} from "./controllers/product/Steps/product-price/product-price.component";
import {ProductImageComponent} from "./controllers/product/Steps/product-image/product-image.component";
import {
    ProductConfirmationComponent
} from "./controllers/product/Steps/product-confirmation/product-confirmation.component";

const steps: any = [
    {
        path: '',
        redirectTo: 'detail',
        pathMatch: 'full',
    },
    {
        path: 'detail',
        component: ProductDetailComponent,
        data: {breadcrumb: 'Detail'},
    },
    {
        path: 'price',
        component: ProductPriceComponent,
        data: {breadcrumb: 'Price'},
    },
    {
        path: 'image',
        component: ProductImageComponent,
        data: {breadcrumb: 'Image'},
    },
    {
        path: 'confirmation',
        component: ProductConfirmationComponent,
        data: {breadcrumb: 'Confirmation'},
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                data: {
                    breadcrumb: {
                        label: 'my home',
                        info: 'home',
                        routeInterceptor: (routeLink) => {
                            return routeLink;
                        },
                    },
                },
                component: AppMainComponent,
                children: [
                    {
                        path: '',
                        data: {breadcrumb: 'Dashboard', roles: ["Admin"]},
                        component: DashboardComponent,
                        canActivate: [AuthGuard]
                    },

                    //user
                    {
                        path: 'pages/user',
                        data: {breadcrumb: 'User', roles: ["Admin"]},
                        component: UserComponent,
                        canActivate: [AuthGuard]
                    },

                    //product
                    {
                        path: 'pages/product',
                        data: {breadcrumb: 'Product', roles: ["Admin"]},
                        component: ProductComponent,
                        canActivate: [AuthGuard],
                        children: [
                            {
                                path: 'add',
                                data: {breadcrumb: 'Add Product', roles: ["Admin"]},
                                component: ProductFormComponent,
                                canActivate: [AuthGuard],
                                children: steps
                            },
                            {
                                path: 'edit',
                                data: {breadcrumb: 'Edit Product', roles: ["Admin"]},
                                component: ProductFormComponent,
                                canActivate: [AuthGuard],
                                children: steps
                            },
                        ]
                    },

                    {
                        path: 'pages/product/category',
                        data: {breadcrumb: 'Product Category', roles: ["Admin"]},
                        component: ProductCategoryComponent,
                        canActivate: [AuthGuard]
                    },

                    {
                        path: 'pages/profile',
                        data: {breadcrumb: 'Profile', roles: ["All"]},
                        component: ProfileComponent,
                        canActivate: [AuthGuard]
                    },

                    {
                        path: 'pages/payment',
                        data: {breadcrumb: 'Payment', roles: ["Admin", "Cashier"]},
                        component: PaymentComponent,
                        canActivate: [AuthGuard]
                    },

                    {
                        path: 'pages/waitingList',
                        data: {breadcrumb: 'Waiting List', roles: ["Admin", "Cashier"]},
                        component: WaitingListComponent,
                        canActivate: [AuthGuard]
                    },

                    {
                        path: 'pages/report',
                        data: {breadcrumb: 'Sales Report', roles: ["Admin"]},
                        component: SalesReportComponent,
                        canActivate: [AuthGuard]
                    },

                    {
                        path: 'pages/qna',
                        loadChildren: () => import('../app/controllers/qna/qna.module').then(x => x.QnaModule),
                        data: {breadcrumb: 'QnA', roles: ["Admin"]},
                        // canActivate: [AuthGuard]
                    },

                    {path: 'uikit/formlayout', component: FormLayoutComponent},
                    {path: 'uikit/input', component: InputComponent},
                    {path: 'uikit/floatlabel', component: FloatLabelComponent},
                    {path: 'uikit/invalidstate', component: InvalidStateComponent},
                    {path: 'uikit/button', component: ButtonComponent},
                    {path: 'uikit/table', component: TableComponent},
                    {path: 'uikit/list', component: ListComponent},
                    {path: 'uikit/tree', component: TreeComponent},
                    {path: 'uikit/panel', component: PanelsComponent},
                    {path: 'uikit/overlay', component: OverlaysComponent},
                    {path: 'uikit/media', component: MediaComponent},
                    {
                        path: 'uikit/menu',
                        loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusModule)
                    },
                    {path: 'uikit/message', component: MessagesComponent},
                    {path: 'uikit/misc', component: MiscComponent},
                    {path: 'uikit/charts', component: ChartsComponent},
                    {path: 'uikit/file', component: FileComponent},
                    {path: 'pages/crud', component: CrudComponent},
                    {path: 'pages/timeline', component: TimelineComponent},
                    {path: 'pages/empty', component: EmptyComponent},
                    {path: 'icons', component: IconsComponent},
                    {path: 'blocks', component: BlocksComponent},
                    {path: 'documentation', component: DocumentationComponent}
                ],
            },
            {path: 'pages/landing', component: LandingComponent},
            {path: 'pages/login', component: LoginComponent},
            {path: 'pages/error', component: ErrorComponent},
            {path: 'pages/notfound', component: NotfoundComponent},
            {path: 'pages/access', component: AccessComponent},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {
            // scrollPositionRestoration: 'enabled',
            // anchorScrolling: 'enabled',
            // useHash: true,
            relativeLinkResolution: 'legacy'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

    childrenArray: any[] = [];
}


import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProductDetailComponent} from "./Steps/product-detail/product-detail.component";
import {ProductPriceComponent} from "./Steps/product-price/product-price.component";
import {ProductImageComponent} from './Steps/product-image/product-image.component';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {FileUploadModule} from "primeng/fileupload";
import {ProductConfirmationComponent} from './Steps/product-confirmation/product-confirmation.component';
import {GalleriaModule} from "primeng/galleria";
import {ProductCategoryComponent} from './product-category/product-category.component';
import {ToolbarModule} from "primeng/toolbar";
import {RippleModule} from "primeng/ripple";
import {TooltipModule} from "primeng/tooltip";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {DialogModule} from "primeng/dialog";
import {CalendarModule} from "primeng/calendar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {BreadcrumbModule} from "xng-breadcrumb";

@NgModule({
    declarations: [

        ProductConfirmationComponent,
        ProductCategoryComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            // {
            //     path: '',
            //     redirectTo: 'detail',
            //     pathMatch: 'full',
            //     data: {breadcrumb: 'Detail'},
            // },
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
            },
        ]),
        BreadcrumbModule,
        CardModule,
        ButtonModule,
        FileUploadModule,
        ReactiveFormsModule,
        GalleriaModule,
        RouterModule,
        ToolbarModule,
        RippleModule,
        TooltipModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        LazyLoadImageModule,
        DialogModule,
        CalendarModule,
        ConfirmDialogModule
    ],
    exports: [RouterModule],
    providers: [

        DatePipe,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },]
})
export class ProductModule {
}

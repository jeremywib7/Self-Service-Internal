import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProductDetailComponent} from "./Steps/product-detail/product-detail.component";
import {ProductPriceComponent} from "./Steps/product-price/product-price.component";
import { ProductImageComponent } from './Steps/product-image/product-image.component';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {FileUploadModule} from "primeng/fileupload";
import { ProductConfirmationComponent } from './Steps/product-confirmation/product-confirmation.component';
import {GalleriaModule} from "primeng/galleria";
import { ProductCategoryComponent } from './product-category/product-category.component';
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

@NgModule({
    declarations: [

    ProductConfirmationComponent,
     ProductCategoryComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', redirectTo: 'detail', pathMatch: 'full'},
            {path: 'detail', component: ProductDetailComponent},
            {path: 'price', component: ProductPriceComponent},
            {path: 'image', component: ProductImageComponent},
            {path: 'confirmation', component: ProductConfirmationComponent},
        ]),
        CardModule,
        ButtonModule,
        FileUploadModule,
        ReactiveFormsModule,
        GalleriaModule,
        ToolbarModule,
        RippleModule,
        TooltipModule,
        TableModule,
        InputTextModule,
        DropdownModule,
        FormsModule,
        LazyLoadImageModule,
        DialogModule,
        CalendarModule
    ],
    exports: [RouterModule],
    providers: [DatePipe]
})
export class ProductModule {
}

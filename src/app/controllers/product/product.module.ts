import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProductDetailComponent} from "./Steps/product-detail/product-detail.component";
import {ProductPriceComponent} from "./Steps/product-price/product-price.component";
import { ProductImageComponent } from './Steps/product-image/product-image.component';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {FileUploadModule} from "primeng/fileupload";
import {RxReactiveFormsModule} from "@rxweb/reactive-form-validators";
import { ProductConfirmationComponent } from './Steps/product-confirmation/product-confirmation.component';
import {GalleriaModule} from "primeng/galleria";

@NgModule({
    declarations: [

    ProductConfirmationComponent
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
        RxReactiveFormsModule,
        GalleriaModule
    ],
    exports: [RouterModule]
})
export class ProductModule {
}

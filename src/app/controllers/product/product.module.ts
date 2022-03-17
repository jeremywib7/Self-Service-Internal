import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ProductDetailComponent} from "./Steps/product-detail/product-detail.component";
import {ProductPriceComponent} from "./Steps/product-price/product-price.component";
import { ProductImageComponent } from './Steps/product-image/product-image.component';

@NgModule({
    declarations: [
    ProductImageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', redirectTo: 'detail', pathMatch: 'full'},
            {path: 'detail', component: ProductDetailComponent},
            {path: 'price', component: ProductPriceComponent},
            {path: 'image', component: ProductImageComponent},
        ])
    ],
    exports: [RouterModule]
})
export class ProductModule {
}

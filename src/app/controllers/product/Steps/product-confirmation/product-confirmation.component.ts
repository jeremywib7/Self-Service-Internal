import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../../model/Product";
import {Router} from "@angular/router";
import {ProductCarrousel} from "../../../../model/ProductCarrousel";
import {Galleria} from "primeng/galleria";

@Component({
    selector: 'app-product-confirmation',
    templateUrl: './product-confirmation.component.html',
    styleUrls: ['./product-confirmation.component.scss']
})
export class ProductConfirmationComponent implements OnInit {

    images: any[];

    activeIndex: number = 0;

    productInformation: any;

    @ViewChild('galleria') galleria: Galleria;

    constructor(public productModel: Product, private router: Router) {
    }

    ngOnInit(): void {
        this.productInformation = this.productModel.productInformation;
        this.images = this.productModel.productCarrousel;
    }

    setGalleria(galleria: Galleria) {
        console.log("ok");

        console.log(galleria);
    }

    complete() {
        this.productModel.complete();
    }

    prevPage() {
        this.router.navigate(['pages/product/add/image']);
    }

}

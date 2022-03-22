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

    showThumbnails: boolean;

    activeIndex: number = 0;

    onFullScreenListener: any;

    @ViewChild('galleria') galleria: Galleria;

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    productInformation: any;

    productCarrousel: any;

    constructor(public productModel: Product, private router: Router) {
    }

    ngOnInit(): void {
        this.productInformation = this.productModel.productInformation;
        this.images = this.productModel.productCarrousel;

        console.log(this.images);
    }

    onThumbnailButtonClick() {
        this.showThumbnails = !this.showThumbnails;
    }


    complete() {
        this.productModel.complete();
    }

    prevPage() {
        this.router.navigate(['pages/product/add/image']);
    }

}

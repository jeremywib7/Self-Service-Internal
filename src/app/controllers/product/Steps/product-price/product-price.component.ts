import {Component, OnInit} from '@angular/core';
import {Product} from "../../../../model/Product";
import {Router} from "@angular/router";

@Component({
    selector: 'app-product-price',
    templateUrl: './product-price.component.html',
    styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent implements OnInit {

    constructor(private productModel: Product, private router: Router) {
    }

    ngOnInit(): void {
    }

    nextPage() {
        // if (this.productModel.class && this.seatInformation.seat && this.seatInformation.wagon) {
        //     this.ticketService.ticketInformation.seatInformation = this.seatInformation;
        // }
    }

    prevPage() {
        this.router.navigate(['pages/product/add/detail']);
    }

}

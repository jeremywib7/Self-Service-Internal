import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

    items: MenuItem[];

    constructor() {
    }

    ngOnInit(): void {
        this.items = [
            {
                label: 'Detail',
                routerLink: 'detail'
            },
            {
                label: 'Pricing',
                routerLink: 'price'
            },
            {
                label: 'Image',
                routerLink: 'image'
            },
            {
                label: 'Confirmation',
                routerLink: 'confirmation'
            }
        ];
    }

}

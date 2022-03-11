import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {Product} from "../../model/Product";
import {LazyLoadEvent} from "primeng/api";
import {HttpParams} from "@angular/common/http";
import {ProductService} from "../../service/product.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    selectedProducts: Product[];

    dataTblProducts: Product[];

    cols: any[];

    tblProductLoading: boolean = false;

    totalTblProduct: number = 0;

    params = new HttpParams();

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
    }

    loadProducts(event: LazyLoadEvent) {

        this.tblProductLoading = true;

        let params = new HttpParams();
        params = params.append("page", event.first / event.rows);
        params = params.append("size", event.rows);

        setTimeout(() => {
            this.productService.loadAllProducts(params).subscribe({
                next: (data: object) => {
                    this.dataTblProducts = data['data']['content'];
                    this.totalTblProduct = data['data']['totalElements'];
                    this.tblProductLoading = false;
                    console.log(event);
                },
            });
        }, 1000);

    }

    openAddOrEditProductDialog(editMode?: boolean, product?: Product) {

    }

//   ON ACTION METHOD

    onDeleteSelectedProducts() {

    }

}

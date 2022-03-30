import {Component, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormGroup} from "@angular/forms";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

    editMode: boolean = false;

    tableProductCategoryLoading: boolean = false;

    productCategory: ProductCategory[] = [];

    cols: any[];

    catFg: FormGroup;

    apiBaseUrl = environment.apiBaseUrl;

    projectName = environment.project;

    constructor(
        private productCategoryService: ProductCategoryService,
        private rxFormBuilder: RxFormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.loadAllProductCategory();
    }

    initForm() {
        this.catFg = this.rxFormBuilder.group({
            id: [''],
            categoryName: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.minLength({value: 3}),
                    RxwebValidators.maxLength({value: 20})
                ]
            ],
            createdOn: [''],
            totalProduct: ['']
        });
    }

    loadAllProductCategory() {
        this.productCategoryService.loadProductCategories().subscribe({
            next: (productCategory: ProductCategory) => {
                this.productCategory = productCategory['data'];
            }
        })
    }

    openAddOrEditCategoryDialog(editMode?: boolean, productCategory?: ProductCategory) {

    }

    openDeleteProductCategoryDialog(productCategory: ProductCategory) {

    }

}

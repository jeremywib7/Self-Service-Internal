import {Component, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormGroup} from "@angular/forms";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {UnassignedProduct} from "../../../model/UnassignedProduct";
import {Product} from "../../../model/Product";
import {Dropdown} from "../../../model/Dropdown";

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

    editMode: boolean = false;

    tableProductCategoryLoading: boolean = false;

    productCategory: ProductCategory[] = [];

    unassignedProducts: UnassignedProduct[] = [];

    categoryDd: Dropdown[] = [];

    cols: any[];

    catFg: FormGroup;

    apiBaseUrl = environment.apiBaseUrl;

    projectName = environment.project;

    constructor(
        private productCategoryService: ProductCategoryService,
        private rxFormBuilder: RxFormBuilder
    ) {
        this.initForm();
        this.loadAllProductCategory();
    }

    ngOnInit(): void {
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
            next: (productCategory: ProductCategory[]) => {
                this.productCategory = productCategory['data'];
                this.productCategory.forEach( value => {
                    this.categoryDd.push({
                        label: value['categoryName'],
                        value: value['id'],
                    })
                })
            }
        })
    }

    openAddOrEditCategoryDialog(editMode?: boolean, productCategory?: ProductCategory) {

    }

    openDeleteProductCategoryDialog(productCategory: ProductCategory) {

    }

    saveUnassignedProduct(product: Product[]) {
        this.unassignedProducts = [];
        product.forEach((tblProduct, index) => {
            if (tblProduct['categoryId'] != undefined &&
                tblProduct['categoryId'] != "akisjasas-asajek-ajsoaks-ejakjenafe") {
                this.unassignedProducts.push({
                    productId: tblProduct['id'],
                    categoryId: tblProduct['categoryId']
                })
            }
        });
        console.log(this.unassignedProducts);
    }

}

import {Component, ElementRef, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Product} from "../../../../model/product/Product";
import {ActivatedRoute, Router} from "@angular/router";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ProductCategory} from "../../../../model/product/ProductCategory";
import {ProductService} from "../../../../service/product.service";
import {Dropdown} from "primeng/dropdown";

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
@Injectable()
export class ProductDetailComponent implements OnInit {

    detailInformation: any;

    statusDropdown: any[];

    dataLoaded = false;

    constructor(public productModel: Product,
                private router: Router,
                private route: ActivatedRoute,
                private el: ElementRef,
                public productService: ProductService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.statusDropdown = [
            {label: 'ACTIVE', value: true},
            {label: 'INACTIVE', value: false},
        ];

        this.loadProductCategoryDropdown();
    }

    loadProductCategoryDropdown() {
        this.productService.loadProductCategories().subscribe({
                next: (data: ProductCategory[]) => {
                    data['data'].forEach((value) => {
                        this.productModel.categoryDropdown.category.push({
                            label: value.categoryName,
                            value: value.id
                        })
                    });
                },
            }
        );
    }

    nextPage() {
        if (this.productService.detailFg.valid) {
            this.productModel.productInformation.detailInformation = this.productService.detailFg.value;

            if (this.router.url.includes("/add")) {
                this.router.navigate(['pages/product/add/price']).then();
            } else if (this.router.url.includes("/edit")) {
                this.router.navigate(['pages/product/edit/price']).then();
            }

            this.productModel.detailInformationDone = true;
        } else {
            this.productService.detailFg.markAllAsTouched();
            this.validateFormFields(this.productService.detailFg);
        }
    }

    public validateFormFields(formGroup: FormGroup) {

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                // option 1
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                if (invalidControl) {
                    invalidControl.focus();
                }
                break;

                // option 2
                // let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
                // if ((invalidFields).length != 0) {
                //     invalidFields[1].focus();
                // break;
                // }
            }
        }
    }

    onSelectedCategory(dd: Dropdown) {
        this.productService.detailFg.value.category.categoryName = dd.selectedOption.label;
    }


}

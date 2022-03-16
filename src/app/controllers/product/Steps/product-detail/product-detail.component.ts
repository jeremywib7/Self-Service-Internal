import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {Product} from "../../../../model/Product";
import {Router} from "@angular/router";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ProductCategory} from "../../../../model/ProductCategory";
import {ProductService} from "../../../../service/product.service";

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

    detailInformation: any;

    statusDropdown: any[];

    categoryDropdown: any[] = [];

    productFg: FormGroup;

    constructor(public productModel: Product, private router: Router, private rxFormBuilder: RxFormBuilder,
                private el: ElementRef, private productService: ProductService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.loadProductCategory();

        this.statusDropdown = [
            {label: 'ACTIVE', value: true},
            {label: 'INACTIVE', value: false},
        ];


    }

    initForm() {
        this.productFg = this.rxFormBuilder.group({
            id: [''],
            name: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.minLength({value: 3}),
                    RxwebValidators.maxLength({value: 10})
                ]
            ],
            active: ['', [RxwebValidators.required()]],
            category: this.rxFormBuilder.group({
                id: ['', [RxwebValidators.required()]]
            }),
            description: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.minLength({value: 20}),
                    RxwebValidators.maxLength({value: 100})
                ]
            ],
            totalCalories: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.numeric({
                        acceptValue: NumericValueType.PositiveNumber,
                        allowDecimal: false
                    }),
                    RxwebValidators.maxNumber({value: 10000})
                ]
            ],
        });

    }

    loadProductCategory() {
        this.productModel.categoryDropdown.category = [];
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

        if (this.productFg.valid) {
            this.router.navigate(['pages/product/price']);
            this.productModel.productInformation.detailInformation = this.productFg.value;
            console.log(this.productModel.productInformation.detailInformation);
        } else {
            this.productFg.markAllAsTouched();
            this.validateFormFields(this.productFg);
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


}

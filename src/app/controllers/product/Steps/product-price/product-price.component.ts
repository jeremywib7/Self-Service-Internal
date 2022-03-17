import {Component, ElementRef, OnInit} from '@angular/core';
import {Product} from "../../../../model/Product";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
    selector: 'app-product-price',
    templateUrl: './product-price.component.html',
    styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent implements OnInit {

    productFg: FormGroup;

    availableDropdown: any[];

    constructor(private productModel: Product, private router: Router, private rxFormBuilder: RxFormBuilder,
                private el: ElementRef) {
    }

    ngOnInit(): void {
        this.initForm();

        this.availableDropdown = [
            {label: 'AVAILABLE', value: true},
            {label: 'NOT AVAILABLE', value: false},
        ];
    }

    initForm() {
        // form add or edit product
        this.productFg = this.rxFormBuilder.group({
            unitPrice: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.numeric({
                        acceptValue: NumericValueType.PositiveNumber, allowDecimal: false
                    }),
                    RxwebValidators.greaterThan({fieldName: 'discountedPrice'})
                ],
            ],
            discount: ['', [RxwebValidators.required()]],
            discountPercent: ['', []],
            sliderPercent: ['', []],
            discountedPrice: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.lessThan({fieldName: 'unitPrice'})
                ]
            ],
        });

        this.productFg.patchValue(this.productModel.productInformation.priceInformation);

        //for testing
        // this.productFg.patchValue({
        //     unitPrice: 25000,
        //     discount: true,
        //     discountPercent: 50,
        //     discountedPrice: 12500,
        // })

    }

    inputDiscountValue(event) {

        if (event.value > 100) {
            this.productFg.get('sliderPercent').setValue(100);
            this.productFg.get('discountedPrice').setValue(0);
        } else {
            this.productFg.get('sliderPercent').setValue(event.value);
            this.productFg.get('discountPercent').setValue(event.value);

            let unitPrice = this.productFg.get('unitPrice').value;
            let discountValue = unitPrice * event.value / 100;

            this.productFg.get('discountedPrice').setValue(unitPrice - discountValue);
        }

    }

    nextPage() {
        if (this.productFg.valid) {
            this.productModel.productInformation.priceInformation = this.productFg.value;
            console.log(this.productFg.value);
            this.router.navigate(['pages/product/add/image']);
        } else {
            this.productFg.markAllAsTouched();
            this.validateFormFields(this.productFg);
        }
    }

    prevPage() {
        this.productModel.productInformation.priceInformation = this.productFg.value;
        this.router.navigate(['pages/product/add/detail']);
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
            }
        }
    }

}

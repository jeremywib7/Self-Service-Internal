import {Component, ElementRef, OnInit} from '@angular/core';
import  {FormGroup} from "@angular/forms";
import {Product} from "../../../../model/Product";
import {Router} from "@angular/router";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ProductCategory} from "../../../../model/ProductCategory";
import {ProductService} from "../../../../service/product.service";
import {Dropdown} from "primeng/dropdown";

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

    detailInformation: any;

    statusDropdown: any[];

    dataLoaded = false;

    productFg: FormGroup;

    constructor(public productModel: Product, private router: Router, private rxFormBuilder: RxFormBuilder,
                private el: ElementRef, private productService: ProductService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.productFg = this.rxFormBuilder.group({
            id: [''],
            name: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.minLength({value: 3}),
                    RxwebValidators.maxLength({value: 20})
                ]
            ],
            active: ['', [RxwebValidators.required()]],
            category: this.rxFormBuilder.group({
                id: ['', [RxwebValidators.required()]],
                categoryName: ['']
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

        this.loadProductCategory();

        this.statusDropdown = [
            {label: 'ACTIVE', value: true},
            {label: 'INACTIVE', value: false},
        ];
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
                complete: () => {
                    this.productFg.patchValue(this.productModel.productInformation.detailInformation);

                    //for testing
                    // this.productFg.patchValue({
                    //     name: 'Pasta',
                    //     description: 'A pasta made with love',
                    //     active: true,
                    //     totalCalories: 150,
                    //     category: {
                    //         id: '35b2bcea-02a4-4881-954b-eaf9f9953b02'
                    //         // id: '41abdb19-dc0e-4923-9077-dc5c975ff52c'
                    //     }
                    // })
                }
            }
        );
    }

    nextPage() {

        if (this.productFg.valid) {
            this.productModel.productInformation.detailInformation = this.productFg.value;

            if (this.router.url.includes("/add")) {
                this.router.navigate(['pages/product/add/price']).then();
            } else if (this.router.url.includes("/edit")) {
                this.router.navigate(['pages/product/edit/price']).then();
            }

            this.productModel.detailInformationDone = true;
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

    onSelectedCategory(dd: Dropdown) {
        this.productFg.value.category.categoryName = dd.selectedOption.label;
    }


}

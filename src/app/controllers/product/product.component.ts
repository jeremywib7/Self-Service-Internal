import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../model/Product";
import {LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import {HttpParams} from "@angular/common/http";
import {ProductService} from "../../service/product.service";
import {environment} from "../../../environments/environment";
import {debounceTime, Subscription} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

    subscription: Subscription;

    //for steps
    items: MenuItem[];

    selectedProducts: Product[];

    dataTblProducts: Product[];

    showAddOrEditProductDialog: boolean = false;

    cols: any[];

    categoryDropdown: any[] = [];

    statusDropdown: any[];

    availableDropdown: any[];

    tblProductLoading: boolean = false;

    editMode: boolean = false;

    totalTblProduct: number = 0;

    params = new HttpParams();

    @ViewChild('dt') inputSearch;

    searchFormGroup: FormGroup;

    images: FormArray;

    productFg: FormGroup;

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        private productService: ProductService,
        public productModel: Product,
        private router: Router,
        private el: ElementRef,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private fb: FormBuilder,
        private rxFormBuilder: RxFormBuilder) {
    }

    ngOnInit(): void {
        this.initForm();

        this.availableDropdown = [
            {label: 'AVAILABLE', value: true},
            {label: 'NOT AVAILABLE', value: false},
        ];

        this.subscription = this.productModel.addOrEditCompleteProduct$.subscribe((productInformation) => {

            this.productFg.patchValue(productInformation['detailInformation']);
            this.productFg.patchValue(productInformation['priceInformation']);
            this.productFg.patchValue(productInformation['imageInformation']);

            if (this.productFg.valid) {

                this.productService.addOrAndUpdateProduct(this.productFg.value, this.productModel.pFileUploadProductImg,
                    this.editMode).subscribe({
                    next: () => {
                        this.productModel.resetAddOrEditProductSteps();
                        if (this.editMode) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Product successfully updated'
                            });
                        } else {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Product successfully added'
                            });
                        }
                    },
                });


            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'Please double check required fields'
                });
            }
        });

    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    clear(table: Table) {
        table.clear();
    }

    initForm() {
        //form search
        this.searchFormGroup = this.fb.group({
            searchInput: new FormControl()
        });

        // init search input debounce
        this.searchFormGroup.get('searchInput')
            .valueChanges
            .pipe(debounceTime(1000))
            .subscribe(dataValue => {
                this.inputSearch.filterGlobal(dataValue, 'contains')
            });

        // form add or edit product
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
            discount: ['', [RxwebValidators.required()]],
            unitPrice: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.numeric({
                        acceptValue: NumericValueType.PositiveNumber, allowDecimal: false
                    }),
                    RxwebValidators.maxNumber({value: 1000000}),
                    RxwebValidators.minNumber({value: 1}),
                    RxwebValidators.greaterThanEqualTo({fieldName: 'discountedPrice'})
                ],
            ],
            discountedPrice: ['',
                [
                    RxwebValidators.required(),
                    RxwebValidators.lessThanEqualTo({fieldName: 'unitPrice'})
                ]
            ],
            images: this.rxFormBuilder.array([{
                initialValue: [],
            }])
        });

        this.images = this.productFg.get('images') as FormArray;
        this.images.removeAt(0);

        // this.productService.getUUID().subscribe(
        //     (data: object) => {
        //         const uuid = data['data']['uuid'];
        //         this.productFg.get('id').setValue(uuid);
        //     },
        // );

    }

    isChildComponentActive(): boolean {
        if (this.router.url.includes("/add")) {
            return false;
        } else {
            return true;
        }
        // return this.router.url === '/';
    }

    loadProducts(event: LazyLoadEvent) {

        this.tblProductLoading = true;

        let params = new HttpParams();
        params = params.append("page", event.first / event.rows);

        if (event.globalFilter) {
            params = params.append("searchKeyword", event.globalFilter);
        }

        if (event.sortField) {
            params = params.append("sortedFieldName", event.sortField);
        }

        params = params.append("order", event.sortOrder);
        params = params.append("size", event.rows);

        setTimeout(() => {
            this.productService.loadAllProducts(params).subscribe({
                next: (data: object) => {
                    this.dataTblProducts = data['data']['content'];
                    this.totalTblProduct = data['data']['totalElements'];
                    this.tblProductLoading = false;
                },
            });
        }, 1000);

    }

    public validateFormFields(formGroup: FormGroup) {
        for (const key of Object.keys(formGroup.controls)) {
            if (formGroup.controls[key].invalid) {
                console.log(key);
                break;
            }
        }
    }


    openAddOrEditProductSteps(editMode: boolean) {
        if (editMode) {

        } else {
            this.router.navigate(['pages/product/add']);
        }
    }


    onDeleteSelectedProducts() {

    }

}

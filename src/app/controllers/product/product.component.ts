import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../model/Product";
import {ConfirmationService, LazyLoadEvent, MenuItem, MessageService} from "primeng/api";
import {HttpEvent, HttpEventType, HttpParams} from "@angular/common/http";
import {ProductService} from "../../service/product.service";
import {environment} from "../../../environments/environment";
import {catchError, debounceTime, map, of, shareReplay, Subscription, switchMap} from "rxjs";
import {saveAs} from 'file-saver';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {Table} from "primeng/table";
import {FileStatus} from "../../model/FileStatus";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;


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

    constructor(
        private productService: ProductService,
        public productModel: Product,
        private confirmationService: ConfirmationService,
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

        // if confirmation steps completed, this will be triggered
        this.subscription = this.productModel.addOrEditCompleteProduct$.subscribe((productInformation) => {

            this.productFg.patchValue(productInformation['detailInformation']);
            this.productFg.patchValue(productInformation['priceInformation']);
            this.productFg.patchValue(productInformation['imageInformation']);

            if (this.productFg.valid) {

                // patch image name to form
                // format imageName = (index.extension)
                this.productModel.pFileUploadProductImg.forEach((value, index, array) => {

                    // get extension
                    const ext = value.name.substr(value.name.lastIndexOf('.') + 1);

                    this.productFg.value.images.push({
                        imageName: index + "." + ext
                    })

                });

                // add or edit product
                // save in database
                this.productService.addOrEditProduct(this.productFg.value, this.editMode).subscribe({
                    next: () => {

                        // upload image
                        this.productService.uploadImage(this.productFg.value.name,
                            this.productModel.pFileUploadProductImg).subscribe({

                            // on completed
                            complete: () => {

                                // reset form
                                this.productFg.reset();

                                // reset global state
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
                                this.router.navigate(['pages/product']);
                            }
                        })

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

    }

    isChildComponentActive(): boolean {
        return !(this.router.url.includes("/add") || this.router.url.includes("/edit"));

        // if (this.router.url.includes("/add") || this.router.url.includes("/edit")) {
        //     return false;
        // } else {
        //     return true;
        // }
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

    openAddProductSteps() {
        this.productModel.resetAddOrEditProductSteps();
        this.router.navigate(['pages/product/add']);
    }

    onEditProduct(product: Product) {
        // reset from previous state
        this.productModel.resetAddOrEditProductSteps();

        // fetch into global state from product model
        this.productModel.productInformation.detailInformation = product;
        this.productModel.productInformation.priceInformation = product;
        // @ts-ignore
        this.productModel.productInformation.imageInformation.imageName = product.images;

        //
        // product.images.forEach((value, index, array) => {
        //     let params = new HttpParams();
        //     params = params.append('imageName', product.images[index].imageName);
        //     params = params.append('productName', product.name);
        //
        //     this.productService.downloadProductImage(params).subscribe({
        //         next: response => {
        //             this.reportProgress(response);
        //         }
        //     });
        //
        // });

        this.router.navigate(['pages/product/edit/detail']);
    }

    onDeleteProduct(productId: string, productName: string) {
        this.confirmationService.confirm({
            message:
                `
                 <div>
                    <span>Are you sure you want to delete product <b> "${productName}"</b> ?</span>
                 </div>
                `,
            header: `Delete Product`,
            accept: () => {
                this.productService.deleteProductById(productId).subscribe({
                    next: value => {
                        this.dataTblProducts = this.dataTblProducts.filter(val => val.id !== productId);
                        this.dataTblProducts = [...this.dataTblProducts];

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Product successfully deleted'
                        });
                    }
                })
            },
        });
    }

    onDeleteSelectedProducts() {
        this.confirmationService.confirm({
            message:
                `
                 <div>
                    <span>Are you sure you want to delete selected product ?</span>
                 </div>
                `,
            header: `Delete Selected Product`,
            accept: () => {
                console.log(this.selectedProducts);
            },
        });
    }

}

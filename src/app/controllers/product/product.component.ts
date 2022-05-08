import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../model/Product/Product";
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

        // if confirmation steps completed, this will be triggered by .next
        this.subscription = this.productModel.addOrEditCompleteProduct$.subscribe((productInformation) => {

            // check if edit mode
            // return true if url contains /edit
            this.editMode = this.router.url.includes("/edit");

            this.productFg.patchValue(productInformation['detailInformation']);
            this.productFg.patchValue(productInformation['priceInformation']);

            if (this.productFg.valid) {

                // if no image is selected, then add a random image name
                // spring can't find the image path and add default product image instead
                if (this.productModel.pFileUploadProductImg.length == 0) {
                    this.productFg.value.images.push({
                        imageName: this.productFg.value.name
                    })
                }

                // patch image name to form in a loop
                // format imageName = (index.extension)
                this.productModel.pFileUploadProductImg.forEach((value, index, array) => {

                    // get extension
                    const ext = value.name.substr(value.name.lastIndexOf('.') + 1);

                    // push into form image name
                    this.productFg.value.images.push({
                        imageName: this.productFg.value.id + "_" + index + "." + ext
                    });

                });

                // add or edit product
                // not using switch map to prevent subscribe hell
                // because subscribe will trigger 3 times because report progress true
                this.productService.addOrEditProduct(this.productFg.value, this.editMode).subscribe({
                    next: (response: any) => {

                        // check if no image file to upload
                        if (this.productModel.pFileUploadProductImg.length >= 1) {

                            // upload image
                            // get generated uuid from database
                            this.productService.uploadImage(response.data.id, this.productModel.pFileUploadProductImg)
                                .subscribe({
                                next: response => {
                                    // update progress bar
                                    this.uploadImageProgressBar(response);
                                },
                                complete: () => {
                                    this.onCompleteAddOrEditProduct();
                                }
                            });

                        } else {
                            this.onCompleteAddOrEditProduct();
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

    onCompleteAddOrEditProduct() {
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

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    uploadImageProgressBar(httpEvent: HttpEvent<Object>) {
        switch (httpEvent.type) {
            case HttpEventType.UploadProgress:
                this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading...');
                break;
        }
    }

    updateStatus(loaded: number, total: number, requestType: string) {
        this.productModel.fileStatus.requestType = requestType;
        this.productModel.fileStatus.percent = Math.round(100 * loaded / total);
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

        this.router.navigate(['pages/product/edit/detail']).then();
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
                    next: (response: any) => {
                        this.dataTblProducts = this.dataTblProducts.filter(val => val.id !== productId);
                        this.dataTblProducts = [...this.dataTblProducts];

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message
                        });
                    }
                });
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
                // show only id
                // const result = this.selectedProducts.map(({ id }) => ({ id }));

                let params = new HttpParams();

                this.selectedProducts.forEach(value => {
                    params = params.append("id", value.id);
                });

                this.productService.deleteSelectedProductsById(params).subscribe({
                    next: (response: any) => {
                        this.selectedProducts.forEach(value => {
                            this.dataTblProducts = this.dataTblProducts.filter(val => val.id !== value.id);
                        });

                        this.selectedProducts = [];

                        // refresh table array
                        this.dataTblProducts = [...this.dataTblProducts];

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: response.message
                        });
                    }
                });

            },
        });
    }

}

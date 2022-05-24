import {Component, ElementRef, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/Product/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Product} from "../../../model/Product/Product";
import {Dropdown} from "../../../model/Dropdown";
import {EditableRow, Table} from "primeng/table";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {UnassignedProduct} from "../../../model/Product/UnassignedProduct";
import {HttpParams} from "@angular/common/http";
import {catchError, firstValueFrom, last, lastValueFrom, map, of, switchMap} from "rxjs";

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;

    projectName = environment.project;


    editMode: boolean = false;

    tableProductCategoryLoading: boolean = false;

    showAddOrEditProductCategoryDialog: boolean = false;

    showDeleteConfirmationDialog: boolean = false;

    isInEditMode: boolean = false;

    productCategory: ProductCategory[] = [];

    unassignedProduct: UnassignedProduct[] = [];

    categoryDd: Dropdown[] = [];

    productCategoryCols: any[];

    productCategoryFg: FormGroup;

    element: HTMLElement;

    constructor(
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private translateService: TranslateService,
        private config: PrimeNGConfig,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
        private el: ElementRef
    ) {
        this.initForm();
        this.initCols();
        this.loadAllProductCategory();
    }

    ngOnInit(): void {
        this.translateService.setDefaultLang('en');
    }

    initForm() {
        this.productCategoryFg = this.fb.group({
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

    // method for exporting csv and count column total to display not found message
    initCols() {

        this.productCategoryCols = [
            {field: 'categoryName', header: 'Category Name'},
            {field: 'totalProduct', header: 'Total Product'},
            {field: 'createdOn', header: 'createdOn'},
            {field: 'updatedOn', header: 'updatedOn'},
        ];
    }

    checkCategoryStatus(editing: boolean, categoryName: string): boolean {
        if (categoryName === 'Unassigned') {
            return false
        } else return !editing;

    }

    loadAllProductCategory() {

        this.productCategoryService.loadProductCategories().subscribe({
            next: productCategory => {
                this.responseProductCategory(productCategory['data']);
            }
        })

    }

    responseProductCategory(productCategory: ProductCategory[]) {
        this.productCategory = productCategory;
        // reload table from api

        this.productCategory.forEach(value => {

            // set field as date to filter
            // @ts-ignore
            value.createdOn = new Date(value.createdOn);
            // @ts-ignore
            value.updatedOn = new Date(value.updatedOn);

            if (value.id !== 'akisjasas-asajek-ajsoaks-ejakjenafe') {
                this.categoryDd.push({
                    label: value['categoryName'],
                    value: value['id'],
                });
            }

        });
        this.productCategory = [...this.productCategory]; // refresh by recreating array
    }

    clear(table: Table) {
        table.clear();
    }

    openAddCategoryDialog() {
        this.productCategoryFg.reset();
        this.showAddOrEditProductCategoryDialog = true;
    }

    // example if 3 switch map
    // this.productCategoryService.deleteProductCategory(httpParams).pipe(
    //     switchMap(address => this.productCategoryService.loadProductCategories().pipe(
    //         switchMap(addresss => this.productCategoryService.loadProductCategories().pipe(
    //             map(cities => ({cities, address, addresss}))
    //         ))
    //     ))
    // );

    onDeleteProductCategory(deletedIndex, categoryName: string) {
        this.confirmationService.confirm({
            message: `
                      <div class="mb-2">
                          <span><b> Are you sure you want to delete category "${categoryName}"</b>?</span>
                      </div>
                      <div>
                          <span>( Products "${categoryName}" will be set to category "Unassigned" )</span>
                      </div>
                     `,
            header: `Delete Category`,
            accept: () => {
                let httpParams = new HttpParams();
                httpParams = httpParams.append('productCategoryId', this.productCategory[deletedIndex].id); // append product category id for delete

                // append product id array to set unsigned in loops
                this.productCategory[deletedIndex].products.forEach((product) => {
                    httpParams = httpParams.append('id', product.id);
                });

                this.productCategoryService.deleteProductCategory(httpParams).pipe(
                    catchError((err) => {
                        return of(undefined);
                    }),
                    switchMap(deleteResponse => this.productCategoryService.loadProductCategories().pipe(
                        map(productCategoryResponse => ({productCategoryResponse, deleteResponse}))
                    ))
                ).subscribe({
                    next: ({deleteResponse, productCategoryResponse}) => {

                        this.productCategory = [];
                        this.categoryDd = [];

                        this.responseProductCategory(productCategoryResponse['data']);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Delete product category success!'
                        });


                    }
                });

            },
        });


    }

    // on action method

    onEditCategory(event) {
        console.log(event);
    }

    onRowEditInit(productCategory: ProductCategory) {
        this.isInEditMode = true;
        this.productCategoryFg.patchValue(productCategory)
    }

    onRowEditSave(index, domId) {
        if (this.productCategoryFg.valid) {

            this.productCategoryFg.patchValue({
                // to remove trailing whitespace
                categoryName: this.productCategoryFg.value.categoryName.trim(),

                createdOn: this.datepipe.transform(this.productCategoryFg.value.createdOn,
                    'MM/dd/yyyy HH:mm:ss'),
            });

            this.productCategoryService.updateProductCategory(this.productCategoryFg.value).subscribe({
                next: response => {
                    this.productCategory[index] = response['data']; // update array index

                    // update category dropdown by index in dropdown
                    let ddCategoryIndex = this.categoryDd.findIndex(categoryDd => categoryDd.value ===
                        response.data.id);
                    this.categoryDd[ddCategoryIndex].label = response.data.categoryName;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category updated!'
                    });

                    this.isInEditMode = false;

                    // to close current edit row
                    this.element = document.getElementById(domId + index) as HTMLElement;
                    this.element.click();

                    this.productCategory = [...this.productCategory]; // refresh table
                    this.categoryDd = [...this.categoryDd]; // refresh dropdown
                }
            });
        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    onRowEditCancel() {
        this.isInEditMode = false;
        this.productCategoryFg.reset();
    }

    onEventDropdownUnassigned(productId: string, categoryId: string, index: number) {

        // if category is null and product id is not null, then it is dropdown on clear event (X button clicked)
        if (!categoryId && productId) {

            let itemIndex = this.unassignedProduct.findIndex(unassignedProduct => unassignedProduct.productId === productId);
            this.unassignedProduct.splice(itemIndex, 1); // delete

        } else {
            // on selected category in dropdown

            let itemIndex = this.unassignedProduct.findIndex(unassignedProduct => unassignedProduct.productId === productId);
            // no selected category for the product
            if (itemIndex === -1) {
                this.unassignedProduct.push({
                    productId: productId,
                    categoryId: categoryId
                });

            } else {
                // update selected category for product
                this.unassignedProduct[itemIndex]['categoryId'] = categoryId;
            }

        }
    }

    saveCategoryInProduct() {
        this.productCategoryService.updateUnassignedProductList(this.unassignedProduct).subscribe({
            next: productCategoryResponse => {

                // clear array
                this.productCategory = [];
                this.categoryDd = [];

                // set array
                this.responseProductCategory(productCategoryResponse['data']);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Update product category success!'
                });

            }
        });
    }

    submit() {
        if (this.productCategoryFg.valid) {

            lastValueFrom(this.productCategoryService.addProductCategory(this.productCategoryFg.value)).then(
                value => {
                    // insert row in table
                    this.productCategory = [...this.productCategory, value.data];

                    // insert for dropdown in select unassigned product
                    this.categoryDd = [...this.categoryDd, {label: value.data.categoryName, value: value.data.id}];

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category added!'
                    });
                }).catch((err: any) => {
                console.log(err);
            }).finally(() => {
                this.showAddOrEditProductCategoryDialog = false;
            });

        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    public validateFormFields(formGroup: FormGroup) {
        formGroup.markAllAsTouched();
    }


}

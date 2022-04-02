import {Component, ElementRef, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Product} from "../../../model/Product";
import {Dropdown} from "../../../model/Dropdown";
import {Table} from "primeng/table";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {UnassignedProduct} from "../../../model/UnassignedProduct";

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

    isInEditMode: boolean = false;

    productCategory: ProductCategory[] = [];

    unassignedProduct: UnassignedProduct[] = [];

    categoryDd: Dropdown[] = [];

    productCategoryCols: any[];

    productCategoryFg: FormGroup;

    constructor(
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private translateService: TranslateService,
        private config: PrimeNGConfig,
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

                this.productCategory = productCategory['data'];

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

                })
            }
        })
    }

    clear(table: Table) {
        table.clear();
    }

    openAddCategoryDialog() {
        this.productCategoryFg.reset();
        this.showAddOrEditProductCategoryDialog = true;
    }

    openDeleteProductCategoryDialog(productCategory: ProductCategory) {

    }

    // on action method

    onEditCategory(event) {
        console.log(event);
    }

    onRowEditInit(productCategory: ProductCategory) {
        this.isInEditMode = true;
        this.productCategoryFg.patchValue(productCategory)
    }

    onRowEditSave() {
        this.isInEditMode = false;
        if (this.productCategoryFg.valid) {
            this.productCategoryFg.patchValue({
                // to remove trailing whitespace
                categoryName: this.productCategoryFg.value.categoryName.trim(),

                createdOn: this.datepipe.transform(this.productCategoryFg.value.createdOn,
                    'MM/dd/yyyy HH:mm:ss'),
            });

            this.productCategoryService.updateProductCategory(this.productCategoryFg.value).subscribe({
                next: (value: ProductCategory) => {
                    let index = this.productCategory.findIndex(productCategory => productCategory['id'] ===
                        value['data']['id']);
                    this.productCategory[index] = value['data'];

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category updated!'
                    });

                    this.showAddOrEditProductCategoryDialog = false;

                },
            });
        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    onRowEditCancel(productCategory: ProductCategory, index: number) {
        this.isInEditMode = false;
        this.productCategoryFg.reset()
    }

    onChangedDropdownUnassigned(productId: string, categoryId: string) {

        //if category is null and product id is not null, then it is dropdown on clear event
        if (!categoryId && productId) {

            let itemIndex = this.unassignedProduct.findIndex(unassignedProduct => unassignedProduct.productId === productId);
            this.unassignedProduct.splice(itemIndex, 1); // delete

        } else {

            let itemIndex = this.unassignedProduct.findIndex(unassignedProduct => unassignedProduct.productId === productId);
            if (itemIndex === -1) {
                this.unassignedProduct.push({
                    productId: productId,
                    categoryId: categoryId
                });

            } else {
                this.unassignedProduct[itemIndex]['categoryId'] = categoryId;
            }

        }
        console.log(this.unassignedProduct);
    }

    //
    // saveUnassignedProduct(product: Product[]) {
    //     this.changedProductCategory = [];
    //     product.forEach((tblProduct, index) => {
    //         if (tblProduct['categoryId'] != undefined &&
    //             tblProduct['categoryId'] != "akisjasas-asajek-ajsoaks-ejakjenafe") {
    //             this.changedProductCategory.push({
    //                 productId: tblProduct['id'],
    //                 categoryId: tblProduct['categoryId']
    //             })
    //         }
    //     });
    // }

    saveCategoryInProduct(products: Product[]) {
        products.forEach(value => {
            console.log(value);
        });
    }

    submit(editMode: boolean) {
        if (this.productCategoryFg.valid) {
            if (this.editMode) {

            } else {
                this.productCategoryService.addProductCategory(this.productCategoryFg.value).subscribe({
                    next: value => {
                        this.productCategory = [...this.productCategory, value.data]; // insert row in table
                        this.categoryDd.push({
                            label: value.data.categoryName,
                            value: value.data.id
                        })// insert for dropdown in select unassigned product

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Category added!'
                        });
                    },
                    complete: () => {
                        this.showAddOrEditProductCategoryDialog = false;
                    }
                });
            }

        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    public validateFormFields(formGroup: FormGroup) {
        formGroup.markAllAsTouched();

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                if (invalidControl) {
                    invalidControl.focus();
                }
                break;
            }
        }
    }


}

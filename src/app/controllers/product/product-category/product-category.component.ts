import {Component, ElementRef, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {Product} from "../../../model/Product";
import {Dropdown} from "../../../model/Dropdown";
import {EditableRow, Table} from "primeng/table";
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

    element: HTMLElement;

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

    onRowEditSave(index, id) {
        if (this.productCategoryFg.valid) {

            this.productCategoryFg.patchValue({
                // to remove trailing whitespace
                categoryName: this.productCategoryFg.value.categoryName.trim(),

                createdOn: this.datepipe.transform(this.productCategoryFg.value.createdOn,
                    'MM/dd/yyyy HH:mm:ss'),
            });

            this.productCategoryService.updateProductCategory(this.productCategoryFg.value).subscribe({
                next: (response: any) => {
                    this.productCategory[index] = response['data']; // update array index
                    this.productCategory = [...this.productCategory]; // trigger update array by recreating array primeng

                    // update category dropdown by index in dropdown
                    let ddCategoryIndex = this.categoryDd.findIndex(categoryDd => categoryDd.value ===
                        response.data.id);
                    this.categoryDd[ddCategoryIndex].label = response.data.categoryName;
                    this.categoryDd = [...this.categoryDd]; // refresh dropdown

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category updated!'
                    });

                    this.isInEditMode = false;

                    // to close current edit row
                    this.element = document.getElementById(id+index) as HTMLElement;
                    this.element.click();

                },
                complete: () => {

                }
            });

        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    onRowEditCancel(productCategory: ProductCategory, index: number) {
        this.isInEditMode = false;
        this.productCategoryFg.reset()
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

    saveCategoryInProduct(products: Product[]) {
        products.forEach(value => {
            console.log(value);
        });
    }

    submit() {
        if (this.productCategoryFg.valid) {

            this.productCategoryService.addProductCategory(this.productCategoryFg.value).subscribe({
                next: value => {
                    // insert row in table
                    this.productCategory = [...this.productCategory, value.data];

                    // insert for dropdown in select unassigned product
                    this.categoryDd = [...this.categoryDd, {label: value.data.categoryName, value: value.data.id}];

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

        } else {
            this.validateFormFields(this.productCategoryFg);
        }
    }

    public validateFormFields(formGroup: FormGroup) {
        formGroup.markAllAsTouched();
    }


}

import {Component, ElementRef, OnInit} from '@angular/core';
import {ProductCategory} from "../../../model/ProductCategory";
import {environment} from "../../../../environments/environment";
import {ProductCategoryService} from "../../../service/product-category.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {UnassignedProduct} from "../../../model/UnassignedProduct";
import {Product} from "../../../model/Product";
import {Dropdown} from "../../../model/Dropdown";
import {Table} from "primeng/table";
import {MessageService} from "primeng/api";
import {DatePipe} from "@angular/common";

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

    unassignedProducts: UnassignedProduct[] = [];

    categoryDd: Dropdown[] = [];

    productCategoryCols: any[];

    clonedProducts: { [s: string]: ProductCategory; } = {};

    productCategoryFg: FormGroup;

    constructor(
        private productCategoryService: ProductCategoryService,
        private messageService: MessageService,
        public datepipe: DatePipe,
        private fb: FormBuilder,
        private el: ElementRef
    ) {
        this.initForm();
        this.initCols();
        this.loadAllProductCategory();
    }

    ngOnInit(): void {
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

                    this.categoryDd.push({
                        label: value['categoryName'],
                        value: value['id'],
                    });
                })
            }
        })
    }

    onEditCategory(event) {
        console.log(event);
    }

    clear(table: Table) {
        table.clear();
    }

    openAddOrEditCategoryDialog(editMode?: boolean, productCategory?: ProductCategory) {
        this.productCategoryFg.reset();
        this.showAddOrEditProductCategoryDialog = true;
    }

    trackByFn(index, row) {
        return index;
    }

    openDeleteProductCategoryDialog(productCategory: ProductCategory) {

    }

    // on action method

    onRowEditInit(productCategory: ProductCategory) {
        this.isInEditMode = true;
        this.productCategoryFg.patchValue(productCategory)
        // this.clonedProducts[productCategory.id] = {...productCategory};
        // console.log(this.clonedProducts);
    }

    checkTable(table) {

    }

    onRowEditSave() {
        this.isInEditMode = false;
        if (this.productCategoryFg.valid) {
            this.productCategoryFg.patchValue({
                createdOn: this.datepipe.transform(this.productCategoryFg.value.createdOn,
                    'MM/dd/yyyy HH:mm:ss'),
            });

            console.log(this.productCategoryFg.value);


            this.productCategoryService.updateProductCategory(this.productCategoryFg.value).subscribe({
                next: value => {

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category updated!'
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

    onRowEditCancel(productCategory: ProductCategory, index: number) {
        this.isInEditMode = false;
        this.productCategoryFg.reset()
        // this.products2[index] = this.clonedProducts[product.id];
        // delete this.clonedProducts[product.id];
    }

    //

    saveUnassignedProduct(product: Product[]) {
        this.unassignedProducts = [];
        product.forEach((tblProduct, index) => {
            if (tblProduct['categoryId'] != undefined &&
                tblProduct['categoryId'] != "akisjasas-asajek-ajsoaks-ejakjenafe") {
                this.unassignedProducts.push({
                    productId: tblProduct['id'],
                    categoryId: tblProduct['categoryId']
                })
            }
        });
    }

    submit(editMode: boolean) {
        if (this.productCategoryFg.valid) {
            if (this.editMode) {

            } else {
                this.productCategoryService.addProductCategory(this.productCategoryFg.value).subscribe({
                    next: value => {
                        this.productCategory = [...this.productCategory, value['data']]; // insert row
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

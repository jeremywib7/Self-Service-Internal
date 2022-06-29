import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {Product} from "../model/Product/Product";
import {UnassignedProduct} from "../model/Product/UnassignedProduct";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    detailFg: FormGroup;

    requestHeader = new HttpHeaders(
        {"No-Auth": "True"}
    )

    constructor(
        private httpClient: HttpClient,
        private rxFormBuilder: FormBuilder
    ) {
        this.detailFg = this.rxFormBuilder.group({
            id: [''],
            name: new FormControl('',
                {
                    validators: [
                        RxwebValidators.required(),
                        RxwebValidators.minLength({value: 3}),
                        RxwebValidators.maxLength({value: 20}),],
                    updateOn: "change"
                }),
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
        }, {updateOn: 'change'});

    }

    public addOrEditProduct(product: Product, editMode: boolean) {
        if (editMode) {
            return this.httpClient.put<Product>(`${this.apiServerUrl}/${this.project}/product/update`, product);
        } else {
            return this.httpClient.post<Product>(`${this.apiServerUrl}/${this.project}/product/add`, product);
        }
    }

    public uploadImage(productId: string, imageFiles: File[]) {

        if (imageFiles) {

            const formData: FormData = new FormData();
            formData.append('productId', productId);
            imageFiles.forEach((obj) => {
                formData.append('files', obj);
            });

            return this.httpClient.post(`${this.apiServerUrl}/${this.project}/images/product/upload`, formData, {
                reportProgress: true,
                observe: 'events'
            });

        }

        return null;
    }

    downloadProductImage(params: HttpParams): Observable<any> {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/images/product/download`, {
            params,
            responseType: 'blob'
        });
    }

    public getUUID(): Observable<any> {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/uuid`);
    }

    deleteProductById(id: string): Observable<Product> {
        return this.httpClient.delete<Product>(`${this.apiServerUrl}/${this.project}/product/delete/${id}`);
    }

    deleteSelectedProductsById(params: HttpParams): Observable<Product> {
        return this.httpClient.delete<Product>(`${this.apiServerUrl}/${this.project}/product/delete/selected`,
            {params});
    }

    //aka set to unassigned
    removeProductInCategory(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/remove`, {params});
    }

    updateUnassignedProduct(unassignedProduct: UnassignedProduct[]) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/product/unassigned/update`, unassignedProduct);
    }

    loadAllProducts(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/all/table`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductCategories() {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
            .pipe(map((data: any) => data || []))
    }

    loadProductsByNameAutoComplete(searchValue: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByNameAutoComplete?name=` + searchValue)
            .pipe(map((data) => data || []))
    }

    loadProductsSearchByName(searchValue: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByName?name=` + searchValue)
            .pipe(map((data) => data || []))
    }

    loadProductDetailById(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findById`, {params})
            .pipe(map((data) => data || []))
    }

    loadProductsByFilter(params: HttpParams) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findByCategory`, {params})
            .pipe(map((data) => data || []))
    }

}

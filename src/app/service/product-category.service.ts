import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ProductCategory} from "../model/ProductCategory";
import {Product} from "../model/Product";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private apiServerUrl = environment.apiBaseUrl;
  private project = environment.project;

  constructor(private httpClient: HttpClient) {
  }

  addProductCategory(productCategory: ProductCategory) {
    return this.httpClient.post(`${this.apiServerUrl}/${this.project}/category/add`, productCategory)
      .pipe(map((data: any) => data || []))
  }

  updateProductCategory(productCategory: ProductCategory) {
    return this.httpClient.put(`${this.apiServerUrl}/${this.project}/category/update`, productCategory)
      .pipe(map((data: any) => data || []))
  }

  deleteProductCategory(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/delete`, {params});
  }

  loadProductCategories() {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/category/all`)
      .pipe(map((data: ProductCategory[]) => data || []))
  }

  loadProductsNameOnlyByCategory(params: HttpParams) {
    return this.httpClient.get(`${this.apiServerUrl}/${this.project}/product/findNameOnly/byCategory`,
      {params}).pipe(map((data) => data || []))
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/User";
import {Product} from "../../model/Product";
import {LazyLoadEvent} from "primeng/api";
import {HttpParams} from "@angular/common/http";
import {ProductService} from "../../service/product.service";
import {environment} from "../../../environments/environment";
import {debounceTime, distinctUntilChanged, Observable, Subject} from "rxjs";

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

    selectedProducts: Product[];

    dataTblProducts: Product[];

    showAddOrEditProductDialog: boolean = false;

    cols: any[];

    tblProductLoading: boolean = false;

    totalTblProduct: number = 0;

    params = new HttpParams();

    @ViewChild('dt') inputSearch;

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(private productService: ProductService) {
    }

    ngOnInit(): void {
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
                    console.log(event);
                },
            });
        }, 1000);

    }

    openAddOrEditProductDialog(editMode?: boolean, product?: Product) {

    }

//   ON ACTION METHOD

    onDeleteSelectedProducts() {

    }

    searchChangeObserver;

    onSearchProduct(searchValue: string) {
        if (!this.searchChangeObserver) {
            new Observable(observer => {
                this.searchChangeObserver = observer;
            }).pipe(debounceTime(2000)) // wait 300ms after the last event before emitting last event
                .pipe(distinctUntilChanged()) // only emit if value is different from previous value
                .subscribe(console.log);
        }

        this.searchChangeObserver.next(this.inputSearch.filterGlobal(searchValue, 'contains'));
    }

    // onSearchProduct(searchValue : string) {
    //     this.inputSearch.filterGlobal(searchValue, 'contains');
    // }
}

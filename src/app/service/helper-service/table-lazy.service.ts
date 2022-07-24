import {Injectable} from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {LazyLoadEvent} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class TableLazyService {

    constructor() {
    }

    createParams(event: LazyLoadEvent): HttpParams {
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
        return params;
    }
}

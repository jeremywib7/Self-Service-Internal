import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {CustomerOrder} from "../model/customer/CustomerOrder";

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(
        private httpClient: HttpClient
    ) {
    }

    // list of successful customer order
    loadSalesReport(params: HttpParams): Observable<CustomerOrder> {
        return this.httpClient.get<CustomerOrder>(`${this.apiServerUrl}/${this.project}/reports/sale-report/data`, {
            params: params
        });
    }

    downloadSalesReportPdf(dateFrom: string, dateTill: string): Observable<any> {
        let params = new HttpParams().append("dateFrom", dateFrom).append("dateTill", dateTill);

        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/reports/sale-report`, {
            params: params,
            responseType: 'blob'
        });
    }
}

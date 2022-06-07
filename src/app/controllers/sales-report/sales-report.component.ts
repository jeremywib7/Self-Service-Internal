import {Component, OnInit} from '@angular/core';
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";
import {ReportService} from "../../service/report.service";
import {firstValueFrom, lastValueFrom} from "rxjs";
import * as FileSaver from 'file-saver';
import {DatePipe} from "@angular/common";
import {MessageService} from "primeng/api";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-sales-report',
    templateUrl: './sales-report.component.html',
    styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

    customerOrders: CustomerOrder[] = [];

    totalsProfit: number = 0;

    todayDate: Date = new Date();

    isTblSalesReportLoading: boolean = true;

    dateFrom: Date;

    dateTill: Date;

    constructor(
        private reportService: ReportService,
        public datePipe: DatePipe,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.loadSalesReport().then(r => null);

        this.dateFrom = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        this.dateTill = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
    }

    dateFromChanged() {
        if (this.dateFrom == null) {
            this.dateFrom = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), 1);
        }

        this.isTblSalesReportLoading = true;
        this.loadSalesReportBetweenDate().then(() => {
                this.isTblSalesReportLoading = false;
            }
        );

    }

    dateTillChanged() {
        if (this.dateTill == null) {
            this.dateTill = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth() + 1, 0);
        }

        this.isTblSalesReportLoading = true;
        this.loadSalesReportBetweenDate().then(() =>
            this.isTblSalesReportLoading = false
        );
    }

    async loadSalesReport() {
        let params = new HttpParams();
        await lastValueFrom(this.reportService.loadSalesReport(params)).then((res: any) => {
            this.customerOrders = res.data;

            this.customerOrders.forEach((customerOrder) => {
                this.totalsProfit += customerOrder.totalPrice
            });

        }).finally(() => {
            this.isTblSalesReportLoading = false;
        })
    }

    async loadSalesReportBetweenDate() {
        let dateFromFormatted = this.datePipe.transform(this.dateFrom, 'dd-MM-yyyy') + " 00:00:00";
        let dateTillFormatted = this.datePipe.transform(this.dateTill, 'dd-MM-yyyy') + " 23:59:59";

        let params = new HttpParams()
            .append("dateFrom", dateFromFormatted)
            .append("dateTill", dateTillFormatted);

        await lastValueFrom(this.reportService.loadSalesReport(params)).then((res: any) => {
            this.customerOrders = res.data;

            this.customerOrders.forEach((customerOrder) => {
                this.totalsProfit += customerOrder.totalPrice
            });

        })
    }

    async downloadSalesReport() {
        let dateFromFormatted = this.datePipe.transform(this.dateFrom, 'dd-MM-yyyy') + " 00:00:00";
        let dateTillFormatted = this.datePipe.transform(this.dateTill, 'dd-MM-yyyy') + " 23:59:59";

        await lastValueFrom(this.reportService.downloadSalesReportPdf(dateFromFormatted, dateTillFormatted)).then(response => {

            if (response.type === "application/json") {
                return this.messageService.add({severity: 'info', summary: '', detail: 'No data to export'});
            }

            FileSaver.saveAs(response, "Sales Report (" + dateFromFormatted + ") - (" + dateTillFormatted + ")");
        })
    }

}

import {Component, OnInit} from '@angular/core';
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";
import {ReportService} from "../../service/report.service";
import {firstValueFrom, lastValueFrom} from "rxjs";
import * as FileSaver from 'file-saver';
import {DatePipe} from "@angular/common";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-sales-report',
    templateUrl: './sales-report.component.html',
    styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

    customerOrders: CustomerOrder[] = [];

    dateFrom: Date;

    dateTill: Date;

    constructor(
        private reportService: ReportService,
        public datePipe: DatePipe,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
    }

    async loadSalesReport() {

    }

    async downloadSalesReport() {
        let dateFromFormatted = this.datePipe.transform(this.dateFrom, 'dd-MM-yyyy');
        let dateTillFormatted = this.datePipe.transform(this.dateTill, 'dd-MM-yyyy');

        await lastValueFrom(this.reportService.downloadSalesReportPdf(dateFromFormatted, dateTillFormatted)).then(response => {

            if (response.type == "application/json") {
                return this.messageService.add({severity: 'info', summary: '', detail: 'No data to export'});
            }

            FileSaver.saveAs(response, "Sales Report (" + dateFromFormatted + ") - (" + dateTillFormatted + ")");
        })
    }

}

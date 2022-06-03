import {Component, OnInit} from '@angular/core';
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";

@Component({
    selector: 'app-sales-report',
    templateUrl: './sales-report.component.html',
    styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

    customerOrders: CustomerOrder[] = [];

    dateFrom: Date;

    dateTill: Date;

    constructor() {
    }

    ngOnInit(): void {
    }

}

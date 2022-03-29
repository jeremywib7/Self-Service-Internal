export class WaitingList {
    number: number;
    customerName: string;
    status: string;
    estHour: number;
    estMinute: number;
    estSecond: number;


    constructor(number: number, customerName: string) {
        this.number = number;
        this.customerName = customerName;
    }
}

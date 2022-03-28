export class WaitingList {
    number: number;
    customerName: string;
    estTime: string;
    status: string;

    constructor(number: number, customerName: string, estTime: string) {
        this.number = number;
        this.customerName = customerName;
        this.estTime = estTime;
    }
}

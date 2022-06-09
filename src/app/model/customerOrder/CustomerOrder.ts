import {HistoryProductOrder} from "./HistoryProductOrder";
import {CustomerProfile} from "../CustomerProfile";

export abstract class CustomerOrder {
    id: string;
    number: number;
    status: string;
    orderIsActive: boolean;
    dateTimeCreated: string;
    orderProcessed: boolean;
    orderFinished: boolean;
    updatedOn: string;
    customerProfile: CustomerProfile;
    historyProductOrders: HistoryProductOrder[];
    totalPaid: number;
    totalChange: number;
    totalPrice: number;
    estHour: number;
    estMinute: number;
    estSecond: number;
    estTime: string;
}

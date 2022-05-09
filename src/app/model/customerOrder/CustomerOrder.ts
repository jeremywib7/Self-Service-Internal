import {HistoryProductOrder} from "./HistoryProductOrder";
import {CustomerProfile} from "../CustomerProfile";

export abstract class CustomerOrder {
    id: string;
    number: number;
    status: string;
    dateCreated: string;
    updatedOn: string;
    customerProfile: CustomerProfile;
    historyProductOrders: HistoryProductOrder[];
    totalPrice: number;
}

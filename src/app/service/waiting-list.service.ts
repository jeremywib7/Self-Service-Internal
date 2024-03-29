import {Injectable} from '@angular/core';
import {WaitingList} from "../model/WaitingList";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {User} from "../model/User";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Note} from "../model/util/Note";
import {CustomerOrder} from "../model/customer/CustomerOrder";

@Injectable({
    providedIn: 'root'
})
export class WaitingListService {

    private apiServerUrl = environment.apiBaseUrl;
    private project = environment.project;

    constructor(
        public fireServices: AngularFirestore,
        private httpClient: HttpClient
    ) {
    }

    public getCustomerById(id: string): Observable<User> {
        return this.httpClient.get<User>(`${this.apiServerUrl}/${this.project}/customer/profile/${id}`);
    }

    public getCustomerOrderById(id: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/order/view/byId/${id}`);
    }

    public getCustomerOrderByUsername(username: string) {
        return this.httpClient.get(`${this.apiServerUrl}/${this.project}/order/view/byUsername/${username}`);
    }

    public notifyCustomer(note: Note) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/waitingList/send-notification`,
            note);
    }

    public completePayment(customerOrder: CustomerOrder) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/order/pay`, customerOrder);
    }

    public getSnapToken(customerOrder: CustomerOrder) {
        return this.httpClient.post(`${this.apiServerUrl}/${this.project}/charge`, customerOrder);
    }

    create_NewWaitingList(waitingList: WaitingList) {
        return this.fireServices.collection('Waiting_List').add(waitingList);
    }

    getAllWaitingList() {
        return this.fireServices.collection('Waiting_List', ref => ref.where('status', '!=',
            'COMPLETED')).snapshotChanges();
    }

    // in firebase
    updateStatusToReadyToPickup(waitingList: WaitingList) {
        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/waitingList/update/status/ready-to-pickup`,
            waitingList);
    }

    updateTimer(customerOrder: CustomerOrder): Observable<Object> {
        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/waitingList/update/timer`,
            customerOrder);
    }

    completeOrder(params: HttpParams) {
        return this.httpClient.put(`${this.apiServerUrl}/${this.project}/order/completed`,
            null, {params: params})
    }

    // in firebase
    // update_WaitingListStatus(id: string, status: string) {
    //     this.fireServices.doc(`Waiting_List/${id}`).update({status: status.toUpperCase()}).then(r => null);
    // }

}

import {Injectable} from '@angular/core';
import {WaitingList} from "../model/WaitingList";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

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

    create_NewWaitingList(waitingList: WaitingList) {
        return this.fireServices.collection('Waiting_List').add(waitingList);
    }

    get_AllWaitingList() {
        return this.fireServices.collection('Waiting_List').snapshotChanges();
    }

    update_WaitingListStatus(id: string, status: string) {
        this.fireServices.doc(`Waiting_List/${id}`).update({status: status.toUpperCase()}).then(r => null);
    }

}

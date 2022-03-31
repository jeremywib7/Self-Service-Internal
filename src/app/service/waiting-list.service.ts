import {Injectable} from '@angular/core';
import {WaitingList} from "../model/WaitingList";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
    providedIn: 'root'
})
export class WaitingListService {

    constructor(public fireServices: AngularFirestore) {
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
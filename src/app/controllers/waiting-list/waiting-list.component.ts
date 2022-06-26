import {Component, ElementRef, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";
import {FormBuilder, FormGroup} from "@angular/forms";
import {WaitingList} from "../../model/WaitingList";
import {WaitingListService} from "../../service/waiting-list.service";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {CountdownEvent} from "ngx-countdown";
import {Note} from "../../model/Note";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    showPaymentDialog: boolean = false;

    editMode: boolean = false;

    customerId: string;

    searchByUsernameMsg: Message[];


    isSendingWaitingList: boolean = false;

    isLoadingWaitingList: boolean = false;

    isDoneCheckingCamera: boolean = false;

    isCameraAvl: boolean = false;

    isOnHttpRequest: boolean = false;

    showEditWaitingListDialog: boolean = false;


    customerOrder: CustomerOrder[] = [];

    waitingListFg: FormGroup;
    editCustomerOrderFg: FormGroup;

    waitingLists: WaitingList[] = [];

    waitingList: WaitingList;

    constructor(
        private fb: FormBuilder,
        private waitingListService: WaitingListService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private el: ElementRef) {
    }

    ngOnInit(): void {
        this.initForm();
        this.isLoadingWaitingList = true;
        this.waitingListService.getAllWaitingList().subscribe({
            next: res => {
                this.waitingLists = res.map(a => {
                    const data = a.payload.doc.data(); // DB Questions
                    const id = a.payload.doc.id;
                    return {id, ...data as WaitingList};
                });
                this.isLoadingWaitingList = false;
            },
        });
    }

    initForm() {
        this.waitingListFg = this.fb.group({
            id: ['', [RxwebValidators.required()]],
            number: ['', [RxwebValidators.required()]],
            customerName: ['', [RxwebValidators.required(),]],
            status: ['', [RxwebValidators.required()]],
            estTime: ['', []],
            estHour: [0, [RxwebValidators.required()]],
            estMinute: [0, [RxwebValidators.required()]],
            estSecond: [0, [RxwebValidators.required()]],
        }, {updateOn: 'change'});

        // form to modify time
        this.editCustomerOrderFg = this.fb.group({
            estHour: [0, [RxwebValidators.required()]],
            estMinute: [0, [RxwebValidators.required()]],
            estSecond: [0, [RxwebValidators.required()]],
            customerId: ['', [RxwebValidators.required()]],
        }, {updateOn: 'change'})
    }

    async onOpenEditTimerDialog(waitingList: WaitingList) {
        this.showEditWaitingListDialog = true
        this.editCustomerOrderFg.get("customerId").setValue(waitingList.id);
    }

    async submitEditTimer() {
        const res = await firstValueFrom(this.waitingListService.updateTimer(this.editCustomerOrderFg.value));
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Timer updated successfully',
            life: 3000
        });
    }

    async onSetOrderStatus(waitingList: WaitingList) {
        console.log(waitingList);

        waitingList.status = "WAITING FOR PICKUP";
        waitingList.steps = 3;

        await firstValueFrom(this.waitingListService.updateStatusToReadyToPickup(waitingList)).then(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Order completed',
                    life: 3000
                });
            }
        )
    }

    onNotifyCustomer(waitingList: WaitingList) {

        this.confirmationService.confirm({
            message: `Notify <b> ${waitingList.username} </b> device ?`,
            header: 'Notify',
            accept: () => {
                this.isOnHttpRequest = true;

                const note = new Note();
                note.username = waitingList.username;
                note.messagingToken = waitingList.messagingToken;

                this.waitingListService.notifyCustomer(note).subscribe({
                    next: value => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Customer notified'
                        });
                    }
                }).add(() => {
                    this.isOnHttpRequest = false;
                });
                console.log("ok");
            },
        });
    }

    onCompleteOrder(customerId: string) {
        let params = new HttpParams().append("customerId", customerId);
        this.waitingListService.completeOrder(params).subscribe({
            next: value => {
                console.log(value);
            }
        });
    }
}

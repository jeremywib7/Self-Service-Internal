import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingList} from "../../model/WaitingList";
import {WaitingListService} from "../../service/waiting-list.service";
import {MessageService} from "primeng/api";
import {CountdownEvent} from "ngx-countdown";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

    showPaymentDialog: boolean = false;

    editMode: boolean = false;

    customerId: string;


    isSendingWaitingList: boolean = false;

    isLoadingWaitingList: boolean = false;

    isCameraLoaded: boolean = false;


    waitingListFg: FormGroup;

    waitingLists: WaitingList[] = [];

    waitingList: WaitingList;

    constructor(
        private fb: FormBuilder,
        private waitingListService: WaitingListService,
        private messageService: MessageService,
        private el: ElementRef) {
    }

    ngOnInit(): void {
        this.initForm();
        this.isLoadingWaitingList = true;
        this.waitingListService.get_AllWaitingList().subscribe({
            next: value => {
                this.waitingLists = value.map(e => {
                    return {
                        id: e.payload.doc.id,
                        number: e.payload.doc.data()['number'],
                        customerName: e.payload.doc.data()['customerName'],
                        status: e.payload.doc.data()['status'],
                        estTime: e.payload.doc.data()['estTime'],
                    } as WaitingList;
                });
                this.isLoadingWaitingList = false;
            },
        });

    }


    initForm() {
        this.waitingListFg = this.fb.group({
            id: ['', [RxwebValidators.required()]],
            username: ['', [RxwebValidators.required()]],
            number: ['', [RxwebValidators.required()]],
            customerName: ['', [RxwebValidators.required(),]],
            status: ['', [RxwebValidators.required()]],
            estTime: ['', []],
            estHour: [0, [RxwebValidators.required()]],
            estMinute: [0, [RxwebValidators.required()]],
            estSecond: [0, [RxwebValidators.required()]],
        }, {updateOn: 'change'})

    }

    onTimerFinished(e: CountdownEvent, status: string, id: string) {
        if (e["action"] == "done") {
            if (status !== "WAITING") {
                this.waitingListService.update_WaitingListStatus(id, "WAITING");
            }
        }
    }

    // WL = Waiting List
    updateStatusWL(id, status) {
        this.waitingListService.update_WaitingListStatus(id, status);
    }

    showAddOrEditDialogWaitingList() {
        this.waitingListFg.patchValue({
            estHour: 0,
            estMinute: 0,
            estSecond: 0
        });
        this.showPaymentDialog = true;
    }

    submit() {
        this.waitingListFg.get('status').setValue("PREPARING");

        if (this.waitingListFg.valid) {
            this.isSendingWaitingList = true; // for loading button effect

            // convert estimated time in seconds and total them
            const hourToSecond: number = (this.waitingListFg.get('estHour').value * 60) * 60;
            const minuteToSecond: number = this.waitingListFg.get('estMinute').value * 60;
            const estSecond: number = this.waitingListFg.get('estSecond').value;

            const totalSecond: number = (1000 * ((hourToSecond) +
                (minuteToSecond) + (Number(estSecond))));
            //

            this.waitingListFg.get('estTime').setValue(new Date().getTime() + totalSecond);
            this.waitingListService.create_NewWaitingList(this.waitingListFg.value).then(r => {

                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Waiting list added'
                });

                this.showPaymentDialog = false;
                this.isSendingWaitingList = false;
                this.waitingList = null;
            });

        } else {
            this.validateFormFields(this.waitingListFg);
        }
    }

    validateFormFields(formGroup: FormGroup) {
        formGroup.markAllAsTouched();

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                if (invalidControl) {
                    invalidControl.focus();
                }
                break;
            }
        }
    }

    onResetQrCode() {
        this.customerId = null;
    }

    onConfirmPayment(customerId: string) {
        console.log(customerId);

        this.waitingListService.getCustomerById(customerId).subscribe({
            next: (value: any) => {
                this.customerId = customerId;
                this.waitingListFg.get("id").setValue(customerId);

                console.log(value);
            }
        })

    }
}

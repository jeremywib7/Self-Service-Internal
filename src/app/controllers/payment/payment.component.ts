import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingListService} from "../../service/waiting-list.service";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {environment} from "../../../environments/environment";
import {HistoryProductOrder} from "../../model/customerOrder/HistoryProductOrder";
import {HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    showPaymentDialog: boolean = false;

    editMode: boolean = false;

    customerId: string;

    totalPrice: number = 0;

    currentDevice: MediaDeviceInfo = null;

    searchByUsernameMsg: Message[];


    isSendingWaitingList: boolean = false;

    isDoneCheckingCamera: boolean = false;

    isCameraAvl: boolean = true;


    productList: HistoryProductOrder[] = [];

    waitingListFg: FormGroup;

    constructor(
        private fb: FormBuilder,
        private waitingListService: WaitingListService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private el: ElementRef) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.waitingListFg = this.fb.group({
            id: ['', [RxwebValidators.required()]],
            username: ['', [RxwebValidators.required()]],
            number: ['', [RxwebValidators.required()]],
            status: ['', [RxwebValidators.required()]],
            estTime: ['', []],
            estHour: [0, [RxwebValidators.required()]],
            estMinute: [0, [RxwebValidators.required()]],
            estSecond: [0, [RxwebValidators.required()]],
            totalPaid: [null, [
                RxwebValidators.required(),
                RxwebValidators.greaterThanEqualTo({fieldName: 'totalPrice'})
            ]],
            totalChange: [null, [RxwebValidators.required()]],
            totalPrice: [null, [RxwebValidators.required()]],
        }, {updateOn: 'change'})

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

    onInputPayment(totalPaid: number) {
        this.waitingListFg.get("totalPaid").setValue(totalPaid);
    }

    onCheckingCamera(cameraAvl: boolean) {
        this.isCameraAvl = cameraAvl;
        this.isDoneCheckingCamera = true;
    }

    onResetQrCode() {
        this.confirmationService.confirm({
            message: `
                 <div>
                    <span>Are you sure you want to clear current session?</span>
                 </div>`,
            header: `Reset Session`,
            accept: () => {
                this.customerId = null;
                this.waitingListFg.reset();
            },
        });
    }

    onConfirmPaymentByQrCode(customerId: string) {
        this.searchByUsernameMsg = [];

        this.waitingListService.getCustomerById(customerId).subscribe({
            next: (value: any) => {
                this.patchData(value);
            }
        })

    }

    onConfirmPaymentByUsername(username: string) {
        this.searchByUsernameMsg = [];

        if (username.length != 0) {
            // check order by this customer username
            this.waitingListService.getCustomerByUsername(username).subscribe({
                next: (value: any) => {
                    this.patchData(value);
                }
            })
        }
    }

    patchData(value: any) {
        this.waitingListFg.patchValue(value.data.customerProfile);

        console.log(value.data);

        // list of ordered products
        this.productList = value.data.historyProductOrders;

        this.customerId = value.data.customerProfile.id;
        this.waitingListFg.get("totalPrice").setValue(value.data.totalPrice);
    }

    onCompletePayment() {

        this.confirmationService.confirm({
            message: `
                 <div>
                    <span>Complete payment for customer <b> "${this.waitingListFg.get("username").value}"</b> ?</span>
                 </div>`,
            header: `Complete Payment`,
            accept: () => {

                // let params = new HttpParams().append("customerId", this.customerId)
                //     .append("estHour", this.waitingListFg.get("estHour").value)
                //     .append("estMinute", this.waitingListFg.get("estMinute").value)
                //     .append("estSecond", this.waitingListFg.get("estSecond").value);

                this.waitingListService.completePayment(this.waitingListFg.value).subscribe({
                    next: (value: any) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Order Completed'
                        });

                        this.customerId = null;
                        this.waitingListFg.reset();

                    }
                })

            },
        });

    }
}

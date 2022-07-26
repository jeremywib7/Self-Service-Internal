import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingListService} from "../../service/waiting-list.service";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {environment} from "../../../environments/environment";
import {HistoryProductOrder} from "../../model/customer/HistoryProductOrder";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {firstValueFrom, interval, Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {CustomerOrder} from "../../model/customer/CustomerOrder";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    isOnline: boolean = false;

    snapToken: string;

    estimatedTime: string;

    dateCreated: string;

    customerId: string;

    totalPrice: number = 0;

    currentDevice: MediaDeviceInfo = null;

    searchByUsernameMsg: Message[];


    onPaymentConfirmedButtonLoading: boolean = false;

    isDoneCheckingCamera: boolean = false;

    isCameraAvl: boolean = true;

    showConfirmPaymentDialog: boolean = false;


    productList: HistoryProductOrder[] = [];

    customerOrderFg: FormGroup;

    customerOrder: CustomerOrder;

    currentCustomerProfile: any = {id: '', username: ''};

    constructor(
        private fb: FormBuilder,
        public waitingListService: WaitingListService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private window: Window,
        private router: Router,
        public datePipe: DatePipe,
        private el: ElementRef) {
        this.initForm();
    }

    subscription: Subscription;


    ngOnInit(): void {
        // this.onInit();
        //emit value in sequence every 1 second
        const source = interval(1000);
        this.subscription = source.subscribe(val => this.calculateEstimatedTime());


    }

    onInit() {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
        //change this according to your client-key
        const myMidtransClientKey = 'your-client-key-goes-here';

        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);

        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        }
    }

    calculateEstimatedTime() {
        let estimatedDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy h:mm:ss');

        this.estimatedTime = moment(estimatedDate, 'dd/mm/yyyy h:mm:ss')
            .add(this.customerOrderFg.get("estSecond").value, 'seconds')
            .add(this.customerOrderFg.get("estMinute").value, 'minutes')
            .add(this.customerOrderFg.get("estHour").value, 'hours')
            .format('LTS');
    }

    initForm() {
        this.customerOrderFg = this.fb.group({
            id: [0, [RxwebValidators.required()]],
            estHour: [0, [RxwebValidators.required()]],
            estMinute: [0, [RxwebValidators.required()]],
            estSecond: [0, [RxwebValidators.required()]],
            totalPaid: [0, [
                RxwebValidators.required(),
                RxwebValidators.greaterThanEqualTo({fieldName: 'totalPrice'})
            ]],
            totalChange: [0, [RxwebValidators.required()]],
            totalPrice: [0, [RxwebValidators.required()]],
            customerProfile: this.fb.group({
                id: [0, [RxwebValidators.required()]],
            })
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

    onInputPayment(amount: number) {
        this.customerOrderFg.get("totalPaid").setValue(amount);

        // calculate change
        let totalPrice = this.customerOrderFg.get("totalPrice").value;
        let totalPaid = this.customerOrderFg.get("totalPaid").value;

        let change = totalPaid - totalPrice;
        this.customerOrderFg.get("totalChange").setValue(change);
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
                this.customerOrderFg.reset();
            },
        });
    }

    onConfirmPaymentByQrCode(customerId: string) {
        this.searchByUsernameMsg = [];

        this.waitingListService.getCustomerOrderById(customerId).subscribe({
            next: (value: any) => {
                this.patchData(value);
            }
        })

    }

    onConfirmPaymentByUsername(username: string) {
        this.searchByUsernameMsg = [];

        if (username.length != 0) {
            // check order by this customer username
            this.waitingListService.getCustomerOrderByUsername(username).subscribe({
                next: (value: any) => {
                    this.patchData(value);
                }
            })
        }
    }

    generateSnapAccessToken() {

    }

    patchData(value: any) {
        this.currentCustomerProfile = value.data.customerProfile;
        this.dateCreated = value.data.dateTimeCreated;
        this.productList = value.data.historyProductOrders;
        this.customerId = value.data.customerProfile.id;
        this.customerOrderFg.get("totalPrice").setValue(value.data.totalPrice);
        this.customerOrderFg.get("customerProfile").get("id").setValue(value.data.customerProfile.id);
    }

    async payUsingMidtrans() {
        this.onSnapPay(this.snapToken);
    }

    showPaymentDialog(isOnline: boolean) {
        // invalid and cash payment
        if (this.customerOrderFg.invalid && !isOnline) {
            return this.customerOrderFg.markAllAsTouched();
        }

        // online payment and already has snap token
        this.customerOrderFg.markAsUntouched();
        if (this.snapToken) {
            return this.onSnapPay(this.snapToken);
        }

        // dont have snap token yet
        this.isOnline = isOnline;
        this.showConfirmPaymentDialog = true;
    }

    onCompletePayment() {
        return this.waitingListService.completePayment(this.customerOrderFg.value).subscribe({
            next: (value: any) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order Completed'
                });

                this.customerId = null;
                this.customerOrderFg.reset();

            }
        }).add(() => {
            this.onPaymentConfirmedButtonLoading = false;
            this.showConfirmPaymentDialog = false;
        })
    }

    onSnapPay(snapToken: string) {
        // @ts-ignore
        return snap.pay(snapToken, {
            onSuccess: result => {
                console.log("YOU GOT AN SUCCESS");
            },
            onPending: result => {
                console.log("YOU GOT AN PENDING");
            },
            onError: result => {
                if (result.status_message == "transaction has been succeed") {
                    this.onCompletePayment();
                }
            },
            onClose: () => {

            }
        });
    }

    async onPaymentConfirmed() {
        this.onPaymentConfirmedButtonLoading = true;

        // if cash payment
        if (!this.isOnline) {
            return this.onCompletePayment();
        }

        // if online payment
        if (this.snapToken == null) {
            const token: any = await firstValueFrom(this.waitingListService.getSnapToken(this.customerOrderFg.value));
            this.snapToken = token.snap_token;
        }
        await this.payUsingMidtrans();

        this.showConfirmPaymentDialog = false;
        this.onPaymentConfirmedButtonLoading = false;
    }
}

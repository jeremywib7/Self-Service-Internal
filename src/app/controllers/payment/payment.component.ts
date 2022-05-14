import {Component, ElementRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingListService} from "../../service/waiting-list.service";
import {ConfirmationService, Message, MessageService} from "primeng/api";
import {environment} from "../../../environments/environment";
import {HistoryProductOrder} from "../../model/customerOrder/HistoryProductOrder";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {interval, Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {HttpParams} from "@angular/common/http";
import {CustomerOrder} from "../../model/customerOrder/CustomerOrder";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

    // global environment
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

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
        private waitingListService: WaitingListService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
        public datePipe: DatePipe,
        private el: ElementRef) {
        this.initForm();
    }

    subscription: Subscription;


    ngOnInit(): void {
        this.initForm();

        //emit value in sequence every 1 second
        const source = interval(1000);
        this.subscription = source.subscribe(val => this.calculateEstimatedTime());
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
        this.currentCustomerProfile = value.data.customerProfile;
        this.dateCreated = value.data.dateCreated;
        this.productList = value.data.historyProductOrders;
        this.customerId = value.data.customerProfile.id;
        this.customerOrderFg.get("totalPrice").setValue(value.data.totalPrice);
        this.customerOrderFg.get("customerProfile").get("id").setValue(value.data.customerProfile.id);
    }

    showPaymentDialog() {
        if (this.customerOrderFg.valid) {
            this.showConfirmPaymentDialog = true;
        } else {
            this.customerOrderFg.markAllAsTouched();
        }

    }

    onPaymentConfirmed() {
        this.onPaymentConfirmedButtonLoading = true;

        this.waitingListService.completePayment(this.customerOrderFg.value).subscribe({
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
}

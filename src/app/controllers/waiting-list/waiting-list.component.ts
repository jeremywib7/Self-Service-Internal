import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingList} from "../../model/WaitingList";
import {WaitingListService} from "../../service/waiting-list.service";
import {MessageService} from "primeng/api";

// import {WebSocketService} from "../../service/web-socket.service";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {

    showAddOrEditWaitingList: boolean = false;

    editMode: boolean = false;

    isSendingWaitingList: boolean = false;

    isLoadingWaitingList: boolean = false;

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
                        estHour: e.payload.doc.data()['estHour'],
                        estMinute: e.payload.doc.data()['estMinute'],
                        estSecond: e.payload.doc.data()['estSecond']
                    } as WaitingList;
                });
                this.isLoadingWaitingList = false;
            },
        });
    }


    initForm() {

        this.waitingListFg = this.fb.group({
            number: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            customerName: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            status: ['',
                [
                    RxwebValidators.required(),
                ]
            ],
            estHour: [0,
                [
                    RxwebValidators.required(),
                ]
            ],
            estMinute: [0,
                [
                    RxwebValidators.required(),
                ]
            ],
            estSecond: [0,
                [
                    RxwebValidators.required(),
                ]
            ],

        }, {updateOn: 'change'})

    }

    showAddOrEditDialogWaitingList() {
        this.waitingListFg.patchValue({
            estHour: 0,
            estMinute: 0,
            estSecond: 0
        });
        this.showAddOrEditWaitingList = true;
    }

    submit() {

        this.waitingListFg.get('status').setValue("preparing");

        if (this.waitingListFg.valid) {
            this.isSendingWaitingList = true;
            this.waitingListService.create_NewWaitingList(this.waitingListFg.value).then(r => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Waiting list added'
                });
                this.showAddOrEditWaitingList = false;
                this.isSendingWaitingList = false;
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


}

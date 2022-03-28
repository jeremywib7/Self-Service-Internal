import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {WaitingList} from "../../model/WaitingList";
import {WebSocketService} from "../../service/web-socket.service";

@Component({
    selector: 'app-waiting-list',
    templateUrl: './waiting-list.component.html',
    styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit, OnDestroy {

    showAddOrEditWaitingList: boolean = false;

    editMode: boolean = false;

    waitingListFg: FormGroup;

    waitingList: WaitingList;

    constructor(
        private fb: FormBuilder,
        public webSocketService: WebSocketService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.webSocketService.openWebSocket();
    }

    ngOnDestroy() {
        this.webSocketService.closeWebSocket();
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

    submit() {
        this.waitingListFg.get('status').setValue("preparing");
        this.waitingList = this.waitingListFg.value;

        this.webSocketService.sendData(this.waitingList);
        this.showAddOrEditWaitingList = false;
    }

}

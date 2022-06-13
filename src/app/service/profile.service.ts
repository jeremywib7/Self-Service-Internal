import { Injectable } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";

@Injectable()
export class ProfileService {

    public formProfile: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.formProfile = this.fb.group({
            id: new FormControl(
                '', {
                    validators: []
                }),
            imageUrl: new FormControl('', {
                validators: [
                    RxwebValidators.required()
                ]
            }),
            username: new FormControl(
                '', {
                    validators: [
                        RxwebValidators.required(),
                        RxwebValidators.minLength({value: 3})
                    ]
                }),
            userFirstName: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
            userLastName: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
            gender: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
            dateJoined: new FormControl('',
                {
                    validators: [RxwebValidators.required()]
                }),
            email: new FormControl('', {
                validators: [RxwebValidators.required()]
            }),
            address: new FormControl('',
                {
                    validators: [RxwebValidators.required()]
                }),
            active: new FormControl('',
                {
                    validators: [RxwebValidators.required()]
                }),
            role: this.fb.group({
                roleName: new FormControl('', {
                    validators: [RxwebValidators.required()]
                }),
                roleDescription: new FormControl('', {}),
            }),
            userPassword: new FormControl('',
                {
                    validators: [RxwebValidators.required()]
                }),
            bankAccount: new FormControl('',
                {
                    validators: [RxwebValidators.required()]
                }
            ),
            phoneNumber: new FormControl('',
                {
                    updateOn: 'change',
                    validators: [RxwebValidators.required()]
                }),
        }, {updateOn: 'change'})
    }
}

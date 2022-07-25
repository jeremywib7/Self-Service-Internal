import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Qna} from "../../controllers/qna/models/qna";
import {FormBuilderConfiguration, RxFormBuilder} from "@rxweb/reactive-form-validators";
import {ChangePasswordForm} from "../../model/auth/form/ChangePassword.form";


@Injectable({
    providedIn: 'root'
})
export class UserAuthService {

    public secretKey = "o9szYIOq1rRMiouNhNvaq96lqUvCekxR";

    changePasswordForm: FormGroup;

    constructor(
        private fb: RxFormBuilder
    ) {
        let changePassword = new ChangePasswordForm();
        this.changePasswordForm = this.fb.formGroup(changePassword, new FormBuilderConfiguration({
            baseAbstractControlOptions: {
                // global: {
                //     updateOn: 'submit'
                // }
            }
        }))
    }

    resetChangePasswordForm() {
        this.changePasswordForm.reset();
        this.changePasswordForm.markAsPristine();
        this.changePasswordForm.markAsUntouched();
    }

    public setRoles(roles: []) {
        localStorage.setItem('_security_role', JSON.stringify(roles['roleName'].toString())
        );
    }

    public getRoles() {
        return JSON.parse(
            localStorage.getItem('_security_role'));
    }

    public setToken(accessToken: string) {
        localStorage.setItem('_security_accessToken',
            JSON.stringify(accessToken)
        );
    }

    public getUsername() {
        return JSON.parse(
            localStorage.getItem('_security_username'));
    }

    public setUsername(username: string) {
        localStorage.setItem('_security_username', JSON.stringify(username));
    }

    public getToken() {
        return JSON.parse(localStorage.getItem('_security_accessToken'));
    }

    public clear() {
        localStorage.clear();
    }

    public isLoggedIn() {
        return this.getRoles() && this.getToken();
    }

}

import {Component, OnDestroy} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {Subscription} from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {UserAuthService} from "./service/user-auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NumericValueType, RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    authMenus: MenuItem[];

    showChangePasswordDialog : boolean = false;

    changePasswordForm: FormGroup;

    constructor(
        public appMain: AppMainComponent,
        public confirmationService: ConfirmationService,
        private userAuthService: UserAuthService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.authMenus = [
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'User Profile',
                        routerLink: '/pages/profile',
                        icon: 'pi pi-fw pi-user',
                    },
                    {
                        label: 'Reset Password',
                        command: () => this.onResetPassword(),
                        icon: 'pi pi-fw pi-calendar-times',
                    }
                ]
            },
            // {
            //     separator: true
            // },
            // {
            //     label: 'Logout',
            //     command: () => this.onLogoutClicked(),
            //     icon: 'pi pi-fw pi-power-off'
            // }
        ];

        this.changePasswordForm = this.fb.group({
            name: new FormControl('',
                {
                    validators: [
                        RxwebValidators.required(),
                        RxwebValidators.minLength({value: 3}),
                        RxwebValidators.maxLength({value: 20}),],
                    updateOn: "change"
                }),
            active: ['', [RxwebValidators.required()]],
            category: this.fb.group({
                id: ['', [RxwebValidators.required()]],
                categoryName: ['']
            }),
        }, {updateOn: 'change'});

    }

    onResetPassword() {
        this.showChangePasswordDialog = true;
    }

    onLogout() {
        this.confirmationService.confirm({
            header: 'Logout',
            message: 'Are you sure that you want to logout?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userAuthService.clear();
                this.router.navigate(['/pages/login'])
            },
        });
    }

    submit() {

    }
}

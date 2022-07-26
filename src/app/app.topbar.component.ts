import {Component, ElementRef} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {UserAuthService} from "./service/auth-service/user-auth.service";
import {Router} from "@angular/router";
import {FormService} from "./service/helper-service/form.service";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {UserService} from "./service/user.service";
import {ChangePasswordInterface} from "./model/auth/interface/ChangePassword.interface";
import {ProfileService} from "./service/profile.service";
import {EncryptDecryptService} from "./service/encrypt-decrypt.service";
import {HttpParams} from "@angular/common/http";
import {HttpResponse} from "./model/util/HttpResponse";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    authMenus: MenuItem[];

    showChangePasswordDialog: boolean = false;

    constructor(
        public appMain: AppMainComponent,
        public confirmationService: ConfirmationService,
        public authS: UserAuthService,
        private encryptDecryptS: EncryptDecryptService,
        private profileS: ProfileService,
        private messageS: MessageService,
        private userS: UserService,
        private el: ElementRef,
        private formS: FormService,
        private router: Router,
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
                        label: 'Change Password',
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

    }

    async onResetPassword() {
        this.showChangePasswordDialog = true;
        let params = new HttpParams().append("username", this.authS.getUsername());
        const res: any = await firstValueFrom(this.userS.getUserByUsername(params));
        this.authS.changePasswordForm.get('username').setValue(res.data.username);
    }

    onLogout() {
        this.confirmationService.confirm({
            header: 'Logout',
            message: 'Are you sure that you want to logout?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.authS.clear();
                this.router.navigate(['/pages/login'])
            },
        });
    }

    async submit() {
        if (this.authS.changePasswordForm.invalid) {
            return this.formS.validateFormFields(this.authS.changePasswordForm, this.el);
        }

        await firstValueFrom(this.userS.changePassword(this.authS.changePasswordForm.value)).catch(err => {
            if (err.error.message == 'Password is incorrect') {
                this.authS.changePasswordForm.get('oldPassword').setErrors({"oldPasswordFalse": true});
            }
        });

        this.showChangePasswordDialog = false;

        this.messageS.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Change password success!'
        });

    }
}

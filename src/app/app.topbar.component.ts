import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {UserAuthService} from "./service/auth-service/user-auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

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

    onResetPassword() {
        this.showChangePasswordDialog = true;
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

    submit() {

    }
}

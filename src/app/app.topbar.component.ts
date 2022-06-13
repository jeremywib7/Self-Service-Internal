import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {UserAuthService} from "./service/user-auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    constructor(
        public appMain: AppMainComponent,
        private confirmationService: ConfirmationService,
        private userAuthService: UserAuthService,
        private router: Router) { }

    onLogout() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to log out?',
            header: 'Logout',
            accept: () => {
                this.userAuthService.clear();
                this.router.navigate(["/pages/login"]);
            }
        });
    }
}

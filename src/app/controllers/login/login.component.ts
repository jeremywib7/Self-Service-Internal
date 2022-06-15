import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {firstValueFrom, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {NgForm} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserAuthService} from "../../service/user-auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {HistoryRouteService} from "../../service/history.route.service";
import {ProfileService} from "../../service/profile.service";
import {EncryptDecryptService} from "../../service/encrypt-decrypt.service";
import {MenuService} from "../../service/menu.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

    valCheck: string[] = ['remember'];

    password: string;

    config: AppConfig;

    subscription: Subscription;

    previousUrl: string = '';

    constructor(public configService: ConfigService, public userService: UserService, private menuService: MenuService,
                public userAuthService: UserAuthService, public router: Router, public messageService: MessageService,
                private historyRouteService: HistoryRouteService, private encryptDecryptService: EncryptDecryptService) {
        if (userAuthService.isLoggedIn()) {
            this.router.navigate(['/']).then(r => null);
        }
    }

    ngOnInit(): void {
        // from prime ng
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
        //
        this.previousUrl = this.historyRouteService.previousUrl;
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async login(loginForm: NgForm) {
        await firstValueFrom(this.userService.login(loginForm.value)).then(
            (response: any): any => {
                // set in cookies
                this.userAuthService.setRoles(response.user.role);
                this.userAuthService.setToken(response.jwtToken);
                this.userAuthService.setUsername(this.encryptDecryptService.encrypt(response.user.username));

                const userRole = response.user.role.roleName;

                // check previous url if exists
                // if (this.previousUrl && this.previousUrl != "/pages/login") {
                //     this.router.navigate([this.previousUrl]);
                // }

                if (userRole === "Admin") {
                    return this.router.navigate(["/"]);
                }
                //
                if (userRole == "Cashier") {
                    return this.router.navigate(["/pages/payment"]);
                }

                return this.router.navigate(["/"]);
            },
            (error) => {
                this.messageService.add({severity: 'error', summary: 'Sign In Failed', detail: 'Wrong credentials'});
            }
        );
    }

    checkPreviousUrl() {
        if (this.previousUrl && this.previousUrl != "/pages/login") {
            this.router.navigate([this.previousUrl]);
        } else {
            this.router.navigate(['/']);
        }
    }


}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {NgForm} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserAuthService} from "../../service/user-auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

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

    constructor(public configService: ConfigService, public userService: UserService,
                public userAuthService: UserAuthService, public router: Router,
                public messageService: MessageService) {
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public login(loginForm: NgForm) {
        this.userService.login(loginForm.value).subscribe(
            (response: any) => {

                // set in cookies
                this.userAuthService.setRoles(response.user.role);
                this.userAuthService.setToken(response.jwtToken);

                const userRole = response.user.role.roleName;

                if (userRole === "Admin") {
                    this.router.navigate(['/']);
                } else if (userRole === "User") {
                    this.router.navigate(['/']);
                }
            },
            (error) => {
                this.messageService.add({severity: 'error', summary: 'Sign In Failed', detail: 'Wrong credentials'});
            }
        );
    }


}

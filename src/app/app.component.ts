import {Component} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {UserAuthService} from "./service/user-auth.service";
import {Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {UserService} from "./service/user.service";
import {ConfigService} from "./service/app.config.service";
import {AppConfig} from "./api/appconfig";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {

    menuMode = 'static';

    config: AppConfig;


    constructor(
        private primengConfig: PrimeNGConfig,
        private userAuthService: UserAuthService,
        private messageService: MessageService,
        private router: Router,
        private userService: UserService,
        public configService: ConfigService
    ) {
    }

    ngOnInit() {
        this.checkRole();
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    checkRole() {
        if (this.userAuthService.getToken() === undefined || this.userAuthService.getToken() === null ||
            this.userAuthService.getToken() === undefined || this.userAuthService.getToken() === null) {
            this.router.navigate(['/pages/login']);
        } else {
            let params = new HttpParams();
            params = params.append('jwtToken', this.userAuthService.getToken());
            this.userService.checkJWTExpiry(params).subscribe({
                next: value => {
                    if (value['data']['status'] === "expired") {
                        this.userAuthService.clear();
                        this.router.navigate(['/pages/login']);
                    }
                },
                error: (error) => {
                    this.messageService.add({severity: 'error', summary: 'Error', detail: error.message});
                }
            });
        }
    }

    checkSettings(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        // console.log(theme);
        themeElement.setAttribute('href', 'assets/theme/' + 'tailwind-light' + '/theme.css');
        this.configService.updateConfig({...this.config, ...{theme, dark}});
    }
}

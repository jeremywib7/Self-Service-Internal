import {Component, ViewChild} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {UserAuthService} from "./service/user-auth.service";
import {Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {UserService} from "./service/user.service";
import {ConfigService} from "./service/app.config.service";
import {AppConfig} from "./api/appconfig";
import {Toast} from "primeng/toast";
import {DomHandler} from "primeng/dom";

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
        public configService: ConfigService
    ) {
    }

    ngOnInit() {
        this.checkRole();
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    // SOLVED TOAST
    // https://github.com/primefaces/primeng/issues/6825

    @ViewChild(Toast)
    toast: Toast;

    ngDoCheck() {
        if (!(this.toast && this.toast.containerViewChild)) return;
        const requiredZIndex = `${DomHandler.zindex}`;
        const el = this.toast.containerViewChild.nativeElement as HTMLElement;
        if (el.style.zIndex !== requiredZIndex) el.style.zIndex = requiredZIndex;
    }

    private static tokenExpired(token: string) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    checkRole() {
        if (this.userAuthService.getToken() === undefined || this.userAuthService.getToken() === null ||
            this.userAuthService.getToken() === undefined || this.userAuthService.getToken() === null) {
            this.router.navigate(['/pages/login']);
        } else {
            if (AppComponent.tokenExpired(this.userAuthService.getToken())) {
                this.userAuthService.clear();
                this.router.navigate(['/pages/login']);
            }
        }
    }

    checkSettings(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        // console.log(theme);
        themeElement.setAttribute('href', 'assets/theme/' + 'tailwind-light' + '/theme.css');
        this.configService.updateConfig({...this.config, ...{theme, dark}});
    }
}

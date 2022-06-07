import {Component, ViewChild} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {UserAuthService} from "./service/user-auth.service";
import {Router} from "@angular/router";
import {ConfigService} from "./service/app.config.service";
import {AppConfig} from "./api/appconfig";
import {Toast} from "primeng/toast";
import {DomHandler} from "primeng/dom";
import {EncryptDecryptService} from "./service/encrypt-decrypt.service";
import {UserService} from "./service/user.service";
import {lastValueFrom} from "rxjs";
import {HttpParams} from "@angular/common/http";
import {ProfileService} from "./service/profile.service";

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
        private userService: UserService,
        private router: Router,
        private encryptDecryptService : EncryptDecryptService,
        private profileService: ProfileService,
        public configService: ConfigService
    ) {
    }

    async ngOnInit() {
        this.checkRole();
        // this.checkSettings('lara-dark-indigo', true);
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        if (this.userAuthService.getUsername() != null && !this.tokenExpired(this.userAuthService.getToken())) {

            // load user profile
            let params = new HttpParams().append("username", this.userAuthService.getUsername());
            await lastValueFrom(this.userService.getUserByUsername(params)).then((value: any) => {
                this.profileService.formProfile.patchValue(value.data);
            });
             // console.log(this.encryptDecryptService.decrypt(this.userAuthService.getUsername()));
        } else {
            return this.userAuthService.clear();
        }

    }

    private tokenExpired(token: string) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
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

    public static tokenExpired(token: string) {
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
        themeElement.setAttribute('href', 'assets/theme/' + theme + '/theme.css');
        this.configService.updateConfig({...this.config, ...{theme, dark}});
    }


}

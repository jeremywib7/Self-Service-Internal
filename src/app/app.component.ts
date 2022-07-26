import {Component, ViewChild} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {UserAuthService} from "./service/auth-service/user-auth.service";
import {Router} from "@angular/router";
import {ConfigService} from "./service/app.config.service";
import {AppConfig} from "./api/appconfig";
import {Toast} from "primeng/toast";
import {DomHandler} from "primeng/dom";
import {UserService} from "./service/user.service";
import {ReactiveFormConfig} from "@rxweb/reactive-form-validators";

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
        public configService: ConfigService
    ) {
    }

    async ngOnInit() {
        ReactiveFormConfig.set({
            "validationMessage": {
                "alpha": "Only alphabets are allowed.",
                "alphaNumeric": "Only alphabet and numbers are allowed.",
                "compare": "inputs are not matched.",
                "contains": "value is not contains in the input",
                "creditcard": "Credit card number is not correct",
                "digit": "Only digit are allowed",
                "email": "Email is not valid",
                "greaterThanEqualTo": "please enter greater than or equal to the joining age",
                "greaterThan": "please enter greater than to the joining age",
                "hexColor": "please enter hex code",
                "json": "please enter valid json",
                "lessThanEqualTo": "please enter less than or equal to the current experience",
                "lessThan": "please enter less than or equal to the current experience",
                "lowerCase": "Only lowercase is allowed",
                "maxLength": "Maximum length is {{1}} digit",
                "maxNumber": "Enter value less than equal to {{1}}",
                "minNumber": "Enter value greater than equal to {{1}}",
                "password": "please enter valid password",
                "pattern": "please enter valid zipcode",
                "range": "please enter age between 18 to 60",
                "required": "This field is required",
                "time": "Only time format is allowed",
                "upperCase": "Only uppercase is allowed",
                "url": "Only url format is allowed",
                "zipCode": "enter valid zip code",
                "minLength": "Minimum length is {{1}} digit",

                //custom
                "qnaQuestionExists": "This question already exists",
                "oldPasswordFalse": "Current Password is incorrect",
            }
        });

        this.checkRole();
        // this.checkSettings('lara-dark-indigo', true);
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

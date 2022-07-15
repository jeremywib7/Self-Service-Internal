import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit, ViewChild
} from '@angular/core';
import {AppConfig} from "../../api/appconfig";
import {firstValueFrom, lastValueFrom, Subscription} from "rxjs";
import {ConfigService} from "../../service/app.config.service";
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {UserAuthService} from "../../service/user-auth.service";
import {Router} from "@angular/router";
import {HistoryRouteService} from "../../service/history.route.service";
import {ProfileService} from "../../service/profile.service";
import {EncryptDecryptService} from "../../service/encrypt-decrypt.service";
import {MenuService} from "../../service/menu.service";
import {NumericValueType, RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {FormService} from "../../service/form.service";
import {Message, MessageService} from "primeng/api";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

    @ViewChild('welcome', {static: true}) welcome: ElementRef;   // to access button in ts

    valCheck: string[] = ['remember'];

    password: string;

    resetPasswordMsg: Message[];

    loginForm: FormGroup;

    config: AppConfig;

    subscription: Subscription;

    isButtonLoading: boolean = false;

    previousUrl: string = '';

    constructor(public configService: ConfigService, public userService: UserService, private menuService: MenuService,
                public userAuthService: UserAuthService, public router: Router, public messageService: MessageService,
                private historyRouteService: HistoryRouteService, private encryptDecryptService: EncryptDecryptService,
                private rxFormBuilder: FormBuilder, private formService: FormService, private el: ElementRef,
                private cdr: ChangeDetectorRef) {
        if (userAuthService.isLoggedIn()) {
            this.router.navigate(['/']).then(r => null);
        }

        this.loginForm = this.rxFormBuilder.group({
            userName: ['', [RxwebValidators.required()]],
            userPassword: ['', [RxwebValidators.required()]]
        });

    }

    ngOnInit(): void {
        // from prime ng
        this.config = this.configService.config;
        this.welcome.nativeElement.focus();
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


    async login() {

        if (this.loginForm.invalid) {
            return this.formService.validateFormFields(this.loginForm, this.el);
        }

        this.isButtonLoading = true;

        const response: any = await firstValueFrom(this.userService.login(this.loginForm.value)).catch(
            (error) => {
                this.isButtonLoading = false;
                return this.resetPasswordMsg = [
                    {severity: 'error', detail: error.error.message},
                ];
            }
        );

        console.log("this not running");

        // set in local storage
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.jwtToken);
        this.userAuthService.setUsername(this.encryptDecryptService.encrypt(response.user.username));

        const userRole = response.user.role.roleName;

        // check previous url if exists
        if (this.previousUrl && this.previousUrl != "/pages/login") {
            return this.router.navigate([this.previousUrl]);
        }

        if (userRole === "Admin") {
            return this.router.navigate(["/"]);
        }
        //
        if (userRole == "Cashier") {
            return this.router.navigate(["/pages/payment"]);
        }

        return this.router.navigate(["/"]);
    }

    checkPreviousUrl() {
        if (this.previousUrl && this.previousUrl != "/pages/login") {
            this.router.navigate([this.previousUrl]);
        } else {
            this.router.navigate(['/']);
        }
    }


}

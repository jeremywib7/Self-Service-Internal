import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import {catchError, EMPTY, finalize, Observable} from "rxjs";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {UserAuthService} from "../service/user-auth.service";
import {MessageService} from "primeng/api";
import {LoaderService} from "../service/loader.service";


@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    service_count = 0; // initialize the counter.

    constructor(
        private userAuthService: UserAuthService,
        private router: Router,
        public loaderService: LoaderService,
        public messageService: MessageService,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.headers.get('No-Auth') === 'True') {
            // this.onFinishLoad();
            return next.handle(req.clone());
        }

        const token = this.userAuthService.getToken();

        req = this.addToken(req, token);


        return next.handle(req).pipe(
            finalize(() => {
                // this.onFinishLoad();
            }),
            catchError(
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.userAuthService.clear();
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Session Expired',
                            detail: 'Please log in again'
                        });
                        this.router.navigate(['/pages/login'])
                    } else if (err.status === 403) {
                        this.router.navigate(['/forbidden']);
                    } else {
                        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
                    }
                    return EMPTY;
                }
            ),
        );
    }

    // private onFinishLoad() {
    //     this.service_count--;
    //     if (this.service_count === 0) {
    //         this.loaderService.value.next(100);
    //         setTimeout(() => {
    //             this.loaderService.isLoading.next(false);
    //         }, 1000);
    //     }
    // }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            }
        );
    }

}

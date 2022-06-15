import { Component } from '@angular/core';
import {HistoryRouteService} from "../../service/history.route.service";
import {Router} from "@angular/router";
import {UserAuthService} from "../../service/user-auth.service";

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
})
export class AccessComponent {

    constructor(
        public historyRouteService: HistoryRouteService,
        private userAuthService: UserAuthService,
        private router: Router
    ) {
    }


    onGoBack() {

        // if (this.historyRouteService.previousUrl != null) {
        //     console.log("test");
        //     return this.router.navigate([this.historyRouteService.previousUrl]);
        // }

        if (this.userAuthService.getRoles() == "Admin") {
            return this.router.navigate([""]);
        }

        if (this.userAuthService.getRoles() == "Cashier") {
            return this.router.navigate(["/pages/payment"]);
        }

        return this.router.navigate(["/"]);

    }
}

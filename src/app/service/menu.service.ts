import {Injectable} from '@angular/core';
import {UserAuthService} from "./user-auth.service";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    model: any[];

    constructor(private userAuthService: UserAuthService) {
        this.model = [
            {
                label: 'Home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },

            {
                label: 'Master',
                items: [
                    {label: 'User', icon: 'pi pi-fw pi-user', routerLink: ['/pages/user']},
                    {
                        label: 'Product', icon: 'pi pi-fw pi-shopping-bag',
                        items: [
                            {label: 'Product List', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/product']},
                            {
                                label: 'Product Category',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/pages/product/category']
                            },
                        ]
                    },
                    {label: 'QnA', icon: 'pi pi-fw pi-comments', routerLink: ['/pages/qna']},
                ]
            },

            {
                label: 'Order',
                items: [
                    {label: 'Payment', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/payment']},
                    {label: 'Waiting List', icon: 'pi pi-fw pi-clock', routerLink: ['/pages/waitingList']},
                ]
            },

            {
                label: 'Report',
                items: [
                    {label: 'Sales Report', icon: 'pi pi-fw pi-book', routerLink: ['/pages/report']},
                ]
            }
        ];

    }
}

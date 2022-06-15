import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    model: any[];

    constructor() {

        this.model = [

            {
                label: 'Home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },

            {
                label: 'Main Menu',
                items: [
                    {label: 'User', icon: 'pi pi-fw pi-user', routerLink: ['/pages/user']},
                    {
                        label: 'Product', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {label: 'Product List', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/pages/product']},
                            {
                                label: 'Product Category',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/pages/product/category']
                            },
                        ]
                    },
                ]
            },

            {
                label: 'Order',
                items: [
                    {label: 'Payment', icon: 'pi pi-fw pi-user', routerLink: ['/pages/payment']},
                    {label: 'Waiting List', icon: 'pi pi-fw pi-user', routerLink: ['/pages/waitingList']},
                ]
            },

            {
                label: 'Report',
                items: [
                    {label: 'Sales Report', icon: 'pi pi-fw pi-user', routerLink: ['/pages/report']},
                ]
            }
        ]
    }
}

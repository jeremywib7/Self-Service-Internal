import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

    //for breadcrumb
    static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    // if home link is not empty
    // readonly home = {icon: 'pi pi-home', url: 'dashboard'};
    readonly home = {icon: 'pi pi-home', routerLink: '/'};
    menuItems: MenuItem[];

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // create breadcrumb on init or refresh
        this.menuItems = this.createBreadcrumbs(this.activatedRoute.root);
        console.log(this.activatedRoute.root);

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.menuItems = this.createBreadcrumbs(this.activatedRoute.root));
    }

    // @ts-ignore
    private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: MenuItem[] = []): MenuItem[] {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const label = child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
            if (label != null || label != undefined) {
                breadcrumbs.push({label, url});
            }

            return this.createBreadcrumbs(child, url, breadcrumbs);
        }
    }

}

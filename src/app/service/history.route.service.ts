import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Injectable()
export class HistoryRouteService {

    previousUrl: string = null;
    currentUrl: string = null;

}

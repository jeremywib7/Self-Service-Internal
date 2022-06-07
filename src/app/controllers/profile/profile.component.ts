import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../service/profile.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    constructor(
        public profileService: ProfileService
    ) {
    }

    ngOnInit(): void {
    }

}

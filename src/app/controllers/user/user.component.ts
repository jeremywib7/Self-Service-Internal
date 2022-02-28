import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    selectedUsers: User[];

    deleteUserDialog: boolean = false;

    cols: any[];

    constructor(
        private userService: UserService
    ) {
    }

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    users: User[] = [];
    user: User;

    ngOnInit(): void {
        this.getUsers();

        //for csv export
        this.cols = [
            {field: 'username', header: 'Username'},
            {field: 'role.roleName', header: 'Role'},
        ];
    }

    public getUsers(): void {
        this.userService.getUsers().subscribe(
            (response: User[]) => {
                this.users = response;
                console.log(this.users);
            }
        );
    }

    deleteUser(user: User) {
        this.user = user;
        this.deleteUserDialog = true;
    }

    // deleteSelectedUsers() {
    //     this.deleteUserDialog = true;
    // }

}

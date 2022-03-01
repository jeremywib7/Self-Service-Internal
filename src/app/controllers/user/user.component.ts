import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

    selectedUsers: User[];

    showAddOrEditProductDialog: boolean = false;

    showDeleteUserDialog: boolean = false;

    editMode: boolean = false;

    cols: any[];

    reactiveForm: FormGroup;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
    ) {
    }

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    users: User[] = [];
    user: User;

    ngOnInit(): void {
        this.getUsers();
        this.initForm();

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
            }
        );
    }

    initForm() {
        this.reactiveForm = this.fb.group({
            username: new FormControl(
                this.user === null ? null : this.user?.username, {
                    validators: [Validators.required, Validators.compose(
                        [Validators.minLength(3)])]
                }),
            userFirstName: new FormControl(this.user === null ? null : this.user?.userFirstName, {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]
            }),
            userLastName: new FormControl(this.user === null ? null : this.user?.userLastName, {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]
            }),
            userPassword: new FormControl(this.user === null ? null : this.user?.userPassword, {}),
            email: new FormControl(this.user === null ? null : this.user?.email, {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
            }),
            role: this.fb.group({
                roleName: new FormControl(this.user === null ? null : this.user?.role.roleName, {
                    validators: [Validators.required]
                }),
                roleDescription: new FormControl(this.user?.role.roleDescription, {}),
            }),
            gender: new FormControl(this.user === null ? null : this.user?.gender, {
                validators: [Validators.required]
            }),
            dateJoined: new FormControl(this.user === null ? null : this.user?.dateJoined,
                {
                    validators: [Validators.required]
                }),
            phoneNumber: new FormControl(this.user === null ? null : this.user?.phoneNumber,
                {
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(123456789)])]
                }),
            address: new FormControl(this.user === null ? null : this.user?.address,
                {
                    validators: [Validators.required]
                }),
            userCode: new FormControl(this.user === null ? null : this.user?.userCode,
                {}),
            imageUrl: new FormControl(null,
                {
                    validators: this.user ? [] : [Validators.required]
                }
            ),
            bankAccount: new FormControl(this.user === null ? null : this.user?.bankAccount,
                {
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(1234567891)])]
                }
            ),
        }, {updateOn: 'change'})

    }

    deleteUser(user: User) {
        this.user = user;
        this.showDeleteUserDialog = true;
    }

    openAddOrEditProductDialog(editMode?: boolean, user?: User) {

        if (editMode) {
            this.editMode = true;
        } else {
            this.editMode = false;
        }

        this.showAddOrEditProductDialog = true;
    }

    submit() {

    }

    // deleteSelectedUsers() {
    //     this.deleteUserDialog = true;
    // }

}

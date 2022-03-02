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

    statusDropdown: any[];
    roleDropdown: any[];

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

        this.statusDropdown = [
            {label: 'ACTIVE', value: true},
            {label: 'INACTIVE', value: false},
        ];

        this.roleDropdown = [
            {label: 'Admin', value: 'Admin'},
            {label: 'User', value: 'User'},
            {label: 'Customer', value: 'Customer'}

        ]
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
                '', {
                    validators: [Validators.required, Validators.compose(
                        [Validators.minLength(3)])]
                }),
            userFirstName: new FormControl('', {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('[a-zA-z]*'), Validators.minLength(3)])]
            }),
            userLastName: new FormControl('', {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('[a-zA-z]*'), Validators.minLength(2)])]
            }),
            active: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            userPassword: new FormControl({}),
            email: new FormControl('', {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
            }),
            role: this.fb.group({
                roleName: new FormControl('', {
                    validators: [Validators.required]
                }),
                roleDescription: new FormControl('', {}),
            }),
            gender: new FormControl('', {
                validators: [Validators.required]
            }),
            dateJoined: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            phoneNumber: new FormControl('',
                {
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(123456789)])]
                }),
            address: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            userCode: new FormControl('',
                {}),
            imageUrl: new FormControl(null,
                {
                    validators: this.user ? [] : [Validators.required]
                }
            ),
            bankAccount: new FormControl('',
                {
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(1234567891)])]
                }
            ),
        }, {updateOn: 'change'})

    }

    setSelectedDropdownStatus(status: boolean, badge: boolean): string {
        if (badge) {
            if (status === true) {
                return 'user-badge status-active';
            } else {
                return 'user-badge status-inactive';
            }
        } else {
            if (status === true) {
                return 'Active';
            } else {
                return 'Inactive';
            }
        }
    }

    deleteUser(user: User) {
        this.user = user;
        this.showDeleteUserDialog = true;
    }

    openAddOrEditProductDialog(editMode?: boolean, user?: User) {

        if (editMode) {
            this.editMode = true;
            this.reactiveForm.patchValue(user);
        } else {
            this.editMode = false;
            this.reactiveForm.reset();
            this.reactiveForm.patchValue(null);
        }

        this.showAddOrEditProductDialog = true;
    }

    submit() {
        console.log(this.reactiveForm.value);
    }

    // deleteSelectedUsers() {
    //     this.deleteUserDialog = true;
    // }

}

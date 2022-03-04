import {Component, OnInit} from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    providers: [DatePipe]
})
export class UserComponent implements OnInit {

    selectedUsers: User[];

    uploadedFiles: File;

    showAddOrEditProductDialog: boolean = false;

    showDeleteUserDialog: boolean = false;

    editMode: boolean = false;

    cols: any[];

    statusDropdown: any[];
    roleDropdown: any[];

    viewBrowseButton: boolean = false;

    reactiveForm: FormGroup;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        public datepipe: DatePipe,
        private messageService: MessageService
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
            userCode: new FormControl({}),
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

    uploadUserImage(event) {
        console.log(event.files);
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
        }

        this.showAddOrEditProductDialog = true;
    }

    onSelectedImage(event) {
        this.uploadedFiles = event.currentFiles[0];
        this.reactiveForm.get('imageUrl').setValue(event.currentFiles[0].name);
    }

    onRemoveImage() {
        this.reactiveForm.controls['imageUrl'].reset();
    }

    submit() {

        if (this.reactiveForm.valid) {
            this.reactiveForm.patchValue({
                dateJoined: this.reactiveForm.value.dateJoined.length === 10 ?
                    this.reactiveForm.value.dateJoined :
                    this.datepipe.transform(this.reactiveForm.value.dateJoined,
                        'dd/MM/yyyy'),
                role: {
                    roleDescription: this.reactiveForm.value.role.roleName + " role"
                }
            });

            this.reactiveForm.patchValue({
                userPassword: this.reactiveForm.value.userPassword,
                dateJoined: this.reactiveForm.value.dateJoined.length === 10 ?
                    this.reactiveForm.value.dateJoined :
                    this.datepipe.transform(this.reactiveForm.value.dateJoined,
                        'dd/MM/yyyy'),
                role: {
                    roleDescription: this.reactiveForm.value.role.roleName + " role"
                }
            });


            if (this.editMode === true) {

                this.reactiveForm.patchValue({
                    imageUrl: this.user ? this.user.imageUrl : null,
                });

                this.userService.updateUser(this.reactiveForm.value, this.uploadedFiles).subscribe(
                    (response: User) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User updated'
                        });
                    },
                );
            } else {

                this.reactiveForm.patchValue({
                    userPassword: "1234",
                });

                this.userService.addUser(this.reactiveForm.value, this.uploadedFiles).subscribe(
                    (response: User) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User registered'
                        });
                    },
                );

            }
        } else {
            this.validateFormFields(this.reactiveForm);
        }
        console.log(this.reactiveForm?.value);

    }

    public validateFormFields(formGroup: FormGroup) {

        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
            console.log(field);
            if ((invalidFields).length !== -1) {
                invalidFields[1].focus();
            }
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateFormFields(control);
            }
        })
    }

}

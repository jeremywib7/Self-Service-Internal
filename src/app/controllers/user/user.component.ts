import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from "../../model/User";
import {UserService} from "../../service/user.service";
import {environment} from "../../../environments/environment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ConfirmationService, MessageService} from "primeng/api";
import {HttpParams} from "@angular/common/http";
import {Table} from "primeng/table";
import * as FileSaver from 'file-saver';
import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    providers: [DatePipe]
})
export class UserComponent implements OnInit {

    selectedUsers: User[];

    uploadedFiles: File;

    showAddOrEditUserDialog: boolean = false;

    editMode: boolean = false;

    cols: any[];

    statusDropdown: any[];

    roleDropdown: any[];

    viewBrowseButton: boolean = false;

    tableUserLoading: boolean = false;

    reactiveForm: FormGroup;

    userImgUrl: string;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        public datepipe: DatePipe,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private el: ElementRef
    ) {
    }

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    users: User[] = [];
    user: User;
    private mode: string;

    ngOnInit(): void {
        this.getUsers();
        this.initForm();

        //csv column settings
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
            {label: 'Cashier', value: 'Cashier'},
            {label: 'Chef', value: 'Chef'},
            {label: 'Staff', value: 'Staff'},
            {label: 'User', value: 'User'},
            {label: 'Customer', value: 'Customer'}
        ]

    }

    //pdf column settings
    pdfColumns = [
        {title: "Username", dataKey: "username"},
        {title: "Firstname", dataKey: "userFirstName"},
        {title: "Lastname", dataKey: "userLastName"},
        {title: "Active", dataKey: "active"},
        {title: "Role", dataKey: "role", displayProperty: "roleName"},
        {title: "Date Joined", dataKey: "dateJoined"},
    ];

    pdfTable = [];

    public getUsers(): void {
        this.tableUserLoading = true;
        this.userService.getUsers().subscribe({
                next: (response: User[]) => {
                    this.users = response;
                },
                complete: () => {
                    this.tableUserLoading = false;
                }
            }
        );
    }

    initForm() {
        this.reactiveForm = this.fb.group({
            imageUrl: new FormControl(null,
                {
                    validators: this.user ? [] : [Validators.required]
                }
            ),
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
            gender: new FormControl('', {
                validators: [Validators.required]
            }),
            dateJoined: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            email: new FormControl('', {
                validators: [Validators.required, Validators.compose(
                    [Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')])]
            }),
            address: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            active: new FormControl('',
                {
                    validators: [Validators.required]
                }),
            role: this.fb.group({
                roleName: new FormControl('', {
                    validators: [Validators.required]
                }),
                roleDescription: new FormControl('', {}),
            }),
            userPassword: new FormControl({}),
            bankAccount: new FormControl('',
                {
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(1234567891)])]
                }
            ),
            phoneNumber: new FormControl('',
                {
                    updateOn: 'change',
                    validators: [Validators.required, Validators.compose(
                        [Validators.pattern('[0-9+ ]*'), Validators.min(12345),
                            Validators.max(1234567891020)])]
                }),
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

    exportPdf() {
        this.pdfTable = this.users;

        const doc = new jsPDF('p', 'pt');
        autoTable(doc, {
            tableWidth: "auto",
            columns: this.pdfColumns,
            margin: {horizontal: 15},
            styles: {overflow: "linebreak"},
            bodyStyles: {valign: "top"},
            theme: "striped",
            showHead: "everyPage",
            body: this.pdfTable,
            didParseCell: function (data) {
                if (data.column.raw['displayProperty']) {
                    var prop = data.column.raw['displayProperty'];
                    var text = data.cell.raw[prop];
                    if (text && text.length > 0) {
                        data.cell.text = text;
                    }

                }
            },
            didDrawPage: function (data) {
                // Header
                doc.setFontSize(15);
                doc.setTextColor(40);
                doc.text("Users Data", data.settings.margin.left, 22);
            }
        });
        doc.save('Users Data.pdf');
        this.pdfTable = [];

    }

    exportExcel() {
        import("xlsx").then(xlsx => {
            const worksheet = xlsx.utils.json_to_sheet(this.users);
            const workbook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
            const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
            this.saveAsExcelFile(excelBuffer, "users");
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    // open dialog method

    openAddOrEditUserDialog(editMode?: boolean, user?: User) {

        if (editMode) {
            this.editMode = true;
            console.log(user);
            this.reactiveForm.patchValue(user);
            this.userImgUrl = user.imageUrl;
        } else {
            this.editMode = false;
            this.reactiveForm.reset();
        }

        this.showAddOrEditUserDialog = true;
    }

    openDeleteUserDialog(user: User) {
        this.user = {...user};
        this.confirmationService.confirm({
            message: `Are you sure you want to delete user <b> ${user.username} </b>?`,
            header: 'Delete User',
            accept: () => {
                this.userService.deleteUser(user.username).subscribe({
                    next: () => {
                        this.users = this.users.filter(val => val.username !== this.user.username);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Delete user success!'
                        });
                    },
                });
            },
        });
    }

    //

    //on action method

    onAllSelect() {
        this.selectedUsers = this.selectedUsers.filter(val => val.username !== 'Admin');
    }

    onSelectedImage(event) {
        this.uploadedFiles = event.currentFiles[0];
        this.reactiveForm.get('imageUrl').setValue(event.currentFiles[0].name);
    }

    onRemoveImage() {
        this.reactiveForm.controls['imageUrl'].reset();
    }

    onClearTable(table: Table) {
        table.clear();
    }

    onDeleteSelectedUsers() {
        let params = new HttpParams();

        this.selectedUsers.forEach((value, index, array) => {
            params = params.append("username", value.username.toString());
        });

        this.confirmationService.confirm({
            message: `Are you sure you want to delete selected users?`,
            header: 'Delete Selected Users',
            accept: () => {
                this.userService.deleteSelectedUsers(params).subscribe({
                    next: value => {
                        this.users = this.users.filter(val => !this.selectedUsers.includes(val));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Delete selected users success!'
                        });
                    },
                });
            },
        });
    }

    //

    submit() {

        if (this.reactiveForm.valid) {

            this.reactiveForm.patchValue({

                // to check if the date format already dd/MM/yyyy by length
                dateJoined: this.reactiveForm.value.dateJoined.length === 10 ?
                    this.reactiveForm.value.dateJoined :
                    this.datepipe.transform(this.reactiveForm.value.dateJoined,
                        'dd/MM/yyyy'),
                role: {
                    roleDescription: this.reactiveForm.value.role.roleName + " role"
                }
            });

            if (this.editMode === true) {
                this.mode = 'edit';
            } else {
                this.mode = 'add';
                this.reactiveForm.get('userPassword').setValue("1234");
            }

            this.userService.addOrUpdateUser(this.reactiveForm.value, this.mode, this.uploadedFiles).subscribe({
                next: (userResponse: User) => {
                    if (this.editMode) {
                        let index = this.users.findIndex(user => user['username'] === userResponse['data']['username']);
                        this.users[index] = userResponse['data'];

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User updated'
                        });
                    } else {
                        this.users = [...this.users, userResponse['data']]; // insert row
                        this.users.sort((a, b) => (a.username > b.username) ? 1 : -1); // sort

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'User registered'
                        });
                    }

                    this.showAddOrEditUserDialog = false;
                },
            });

        } else {
            this.validateFormFields(this.reactiveForm);
        }

    }


    public validateFormFields(formGroup: FormGroup) {
        formGroup.markAllAsTouched();

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                if (key === "imageUrl") {
                    (document.getElementById('imageUrl') as HTMLFormElement).focus();
                    break;
                } else {
                    // option 1
                    const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                    if (invalidControl) {
                        invalidControl.focus();
                    }
                    break;

                    // option 2
                    // let invalidFields = [].slice.call(document.getElementsByClassName('ng-invalid'));
                    // if ((invalidFields).length != 0) {
                    //     invalidFields[1].focus();
                    // break;
                    // }

                }
            }
        }
    }

}

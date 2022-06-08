import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../service/profile.service";
import {environment} from "../../../environments/environment";
import {MessageService} from "primeng/api";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    uploadedFiles: File;

    isButtonSaveChangesLoading: boolean = false;

    constructor(
        public profileService: ProfileService,
        private router : Router,
        private userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
    }

    async updateProfile() {

        if (this.profileService.formProfile.valid) {

            this.isButtonSaveChangesLoading = true;

            const res: any = await lastValueFrom(this.userService.updateUser(this.profileService.formProfile.value)).catch(() => {
                this.isButtonSaveChangesLoading = false;
            });

            if (this.uploadedFiles !== undefined) {
                // upload user image
                if (this.uploadedFiles) {
                    await lastValueFrom(this.userService.uploadImageFile(this.uploadedFiles,
                        this.profileService.formProfile.get('id').value)).then(() => {
                    }).catch(() => {
                        this.isButtonSaveChangesLoading = false;
                    });
                }
            }

            this.isButtonSaveChangesLoading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated', life: 3000
            });
            await this.router.navigate(['/']);


        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: 'Please check all required fields', life: 3000
            });
        }
    }

    onSelectedImage(event) {
        this.uploadedFiles = event.currentFiles[0];
    }

}

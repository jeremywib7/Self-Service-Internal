import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../service/profile.service";
import {environment} from "../../../environments/environment";
import {MessageService} from "primeng/api";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {UserService} from "../../service/user.service";

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
        private userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
    }

    async updateProfile() {

        if (this.profileService.formProfile.valid) {

            this.isButtonSaveChangesLoading = true;

            console.log("saving profile...");

            const res: any = await lastValueFrom(this.userService.updateUser(this.profileService.formProfile.value)).catch(() => {
                this.isButtonSaveChangesLoading = false;
            });

            console.log("uploading image...");

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
            console.log(res);


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

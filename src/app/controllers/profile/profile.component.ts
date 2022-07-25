import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from "../../service/profile.service";
import {environment} from "../../../environments/environment";
import {MessageService} from "primeng/api";
import {firstValueFrom, lastValueFrom} from "rxjs";
import {UserService} from "../../service/user.service";
import {Router} from "@angular/router";
import {HttpParams} from "@angular/common/http";
import {UserAuthService} from "../../service/auth-service/user-auth.service";
import {FileUpload} from "primeng/fileupload";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    @ViewChild('avatar') avatar: FileUpload;

    isButtonSaveChangesLoading: boolean = false;

    constructor(
        public profileService: ProfileService,
        private router: Router,
        private userService: UserService,
        private messageService: MessageService,
        private userAuthService: UserAuthService
    ) {
    }

    ngOnInit(): void {
        this.loadUserProfile().then(r => null);
    }

    async loadUserProfile() {
        let params = new HttpParams().append("username", this.userAuthService.getUsername());
        const res: any = await firstValueFrom(this.userService.getUserByUsername(params));
        this.profileService.formProfile.patchValue(res.data);
    }

    async updateProfile() {

        if (this.profileService.formProfile.valid) {

            this.isButtonSaveChangesLoading = true;

            if (this.avatar._files[0] !== undefined) {
                const ext = this.avatar._files[0].name.substr(this.avatar._files[0].name.lastIndexOf('.') + 1);
                this.profileService.formProfile.get("imageUrl").setValue("profile_picture." +ext);

                await lastValueFrom(this.userService.uploadImageFile(this.avatar._files[0],
                    this.profileService.formProfile.get('id').value)).finally(() => {
                    this.isButtonSaveChangesLoading = false;
                });
            }

            const res: any = await lastValueFrom(this.userService.updateUser(this.profileService.formProfile.value)).catch(() => {
                this.isButtonSaveChangesLoading = false;
            });

            this.isButtonSaveChangesLoading = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated', life: 3000
            });

            this.profileService.formProfile.reset();
            await this.router.navigate(['/']);


        } else {
            console.log(this.avatar?._files);
            this.messageService.add({
                severity: 'error',
                summary: 'Failed',
                detail: 'Please check all required fields', life: 3000
            });
        }
    }

}

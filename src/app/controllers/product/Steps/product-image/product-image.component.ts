import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../../model/Product";
import {FormArray, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {MessageService} from "primeng/api";
import {FileUpload} from "primeng/fileupload";
import {ProductCarrousel} from "../../../../model/ProductCarrousel";

@Component({
    selector: 'app-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {

    productFg: FormGroup;

    editMode: boolean = false;

    productInfo: any;

    constructor(public productModel: Product, private router: Router, private el: ElementRef, private rxFormBuilder:
        RxFormBuilder, private messageService: MessageService, private activatedRoute: ActivatedRoute) {

        this.productInfo = this.productModel.productInformation;

        if (this.productInfo.detailInformation.completed === false) {
            this.router.navigate(['pages/product/add/detail']);
        }

    }

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    ngOnInit(): void {
        this.initForm().then(() => {
        });
    }

    async initForm() {
        if (this.activatedRoute.snapshot.queryParams['i']) {
        } else {
            this.editMode = false;
        }
    }

    displayMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    nextPage() {
        this.router.navigate(['pages/product/add/confirmation']).then();
    }

    prevPage() {
        // this.productModel.productInformation.imageInformation = this.productFg.value;
        this.router.navigate(['pages/product/add/price']).then();
    }

    onSelectedImage(event: any): void {

        let lastIndex = event.currentFiles.length - 1;
        let lastImageFile = event.currentFiles[lastIndex];
        let currentImageLength = event.currentFiles.length;
        let previousImageLength = this.productModel.previousImageFileLength;

        // validate maximum 3 image and there is difference with previous length
        // difference may happen because removal of a image
        // to prevent adding same image
        if (currentImageLength <= 3 && previousImageLength != currentImageLength) {

            // update previous image length with current length
            this.productModel.previousImageFileLength = event.currentFiles.length;

            // push last file
            this.productModel.pFileUploadProductImg.push(lastImageFile);

            const reader = new FileReader();

            reader.onload = (event: any) => {
                this.productModel.productCarrousel.push({
                    imageBase64: event.target.result,
                    imageFile: lastImageFile
                });
            };

            reader.readAsDataURL(lastImageFile);
        }

    }

    onRemovedImage(event) {
        let index = this.productModel.productCarrousel.findIndex(image => image.imageFile.name === event.file.name);
        this.productModel.pFileUploadProductImg.splice(index, 1); // remove from global store file
        this.productModel.productCarrousel.splice(index, 1);

        //minus 1 for previous image length
        this.productModel.previousImageFileLength = this.productModel.previousImageFileLength - 1;
    }

    public validateFormFields(formGroup: FormGroup) {

        for (const key of Object.keys(formGroup.controls)) {

            if (formGroup.controls[key].invalid) {
                // option 1
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                if (invalidControl) {
                    invalidControl.focus();
                }
                break;
            }
        }
    }

}

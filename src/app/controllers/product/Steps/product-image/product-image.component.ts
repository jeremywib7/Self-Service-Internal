import {Component, ElementRef, OnInit} from '@angular/core';
import {Product} from "../../../../model/Product/Product";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {MessageService} from "primeng/api";
import {HttpEvent, HttpEventType, HttpParams} from "@angular/common/http";
import {ProductService} from "../../../../service/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {
    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    productFg: FormGroup;

    isDownloadingImage: boolean = false;
    editMode: boolean = false;

    productInfo: any;

    constructor(public productModel: Product, private router: Router, private el: ElementRef, private rxFormBuilder:
                    RxFormBuilder, private messageService: MessageService, private productService: ProductService,
                private sanitizer: DomSanitizer) {

        this.productInfo = this.productModel.productInformation;

        // check if previous steps is not completed
        if (this.productModel.detailInformationDone === false || this.productModel.priceInformationDone === false) {
            this.router.navigate(['pages/product']);
        }

        // check if edit mode
        let id = this.productInfo.detailInformation.id;
        let imageInformation = this.productInfo.imageInformation.imageName;

        if (this.router.url.includes("/edit")) {
            this.editMode = true;

            // reset state
            this.productModel.pFileUploadProductImg = [];
            this.productModel.previousImageFileLength = -1;
            this.productModel.productCarrousel = [];

            imageInformation.forEach((value, index, array) => {
                this.productModel.fileStatus.percent = 0;

                let params = new HttpParams();
                params = params.append('imageName', imageInformation[index].imageName);
                params = params.append('productId', id);

                this.isDownloadingImage = true;
                this.productService.downloadProductImage(params).subscribe({
                    next: (response: any) => {
                        let file = new File([response], imageInformation[index].imageName, { type: "image/jpeg", });

                        this.productModel.pFileUploadProductImg.push(file);

                        // update length
                        this.productModel.previousImageFileLength = this.productModel.pFileUploadProductImg.length;

                        // set image carrousel in confirmation page
                        this.imageReadAsDataUrl(file);

                        this.productModel.pFileUploadProductImg = [...this.productModel.pFileUploadProductImg];

                        // for saving file
                        // let file: File = FileSaver.saveAs(response, `as.jpg`);
                    },
                    complete: () => {
                        this.isDownloadingImage = false;
                    }
                });

            });

        }

    }

    ngOnInit(): void {
    }


    // private reportProgress(httpEvent: HttpEvent<string[] | Blob>) {
    //     switch (httpEvent.type) {
    //         case HttpEventType.UploadProgress:
    //             this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading...');
    //             break;
    //         case HttpEventType.DownloadProgress:
    //             this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
    //             break;
    //         case HttpEventType.ResponseHeader:
    //             break;
    //         case HttpEventType.Response:
    //
    //             if (httpEvent.body instanceof Array) {
    //                 this.productModel.fileStatus.status = 'done';
    //                 for (const filename of httpEvent.body) {
    //                     this.productModel.filenames.unshift(filename);
    //                 }
    //             } else {
    //                 // download logic
    //                 // set tsconfig.json strict: false or add ! in httpEven.body
    //
    //                 // push into global file
    //
    //                 let imageFile = new File([httpEvent.body],
    //                     httpEvent.headers.get('Content-Type'),
    //                     {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`});
    //
    //                 this.productModel.pFileUploadProductImg.push(imageFile);
    //
    //                 // update length
    //                 this.productModel.previousImageFileLength = this.productModel.pFileUploadProductImg.length;
    //
    //                 // set image carrousel in confirmation page
    //                 this.imageReadAsDataUrl(imageFile);
    //
    //                 this.productModel.pFileUploadProductImg = [...this.productModel.pFileUploadProductImg];
    //
    //             }
    //             this.productModel.fileStatus.status = 'done';
    //             break;
    //         default:
    //             break;
    //     }
    // }

    updateStatus(loaded: number, total: number, requestType: string) {
        this.productModel.fileStatus.status = 'progress';
        this.productModel.fileStatus.requestType = requestType;
        this.productModel.fileStatus.percent = Math.round(100 * loaded / total);
    }

    displayMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    nextPage() {

        if (!this.editMode) {
            this.router.navigate(['pages/product/add/confirmation']).then();
        } else if (this.router.url.includes("/edit")) {
            this.router.navigate(['pages/product/edit/confirmation']).then();
        }
    }

    prevPage() {
        if (!this.editMode) {
            this.router.navigate(['pages/product/add/price']).then();
        } else if (this.router.url.includes("/edit")) {
            this.router.navigate(['pages/product/edit/price']).then();
        }
    }

    onSelectedImage(event: any): void {

        let lastIndex = event.currentFiles.length - 1;
        let lastImageFile = event.currentFiles[lastIndex];
        let currentImageLength = event.currentFiles.length;
        let previousImageLength = this.productModel.previousImageFileLength;

        // validate maximum 3 image and there is difference with previous length
        // difference may happen because removal of an image
        // to prevent adding same image
        if (currentImageLength <= 3 && previousImageLength != currentImageLength) {

            // update previous image length with current length
            this.productModel.previousImageFileLength = event.currentFiles.length;

            // push last file
            this.productModel.pFileUploadProductImg.push(lastImageFile);

            // to display in carrousel confirmation
            this.imageReadAsDataUrl(lastImageFile);

        }

    }

    onRemovedImage(event) {
        let index = this.productModel.productCarrousel.findIndex(image => image.imageName === event.file.name);
        this.productModel.pFileUploadProductImg.splice(index, 1); // remove from global store file
        this.productModel.productCarrousel.splice(index, 1);

        //minus 1 for previous image length
        this.productModel.previousImageFileLength = this.productModel.previousImageFileLength - 1;
    }

    imageReadAsDataUrl(file: File) {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            this.productModel.productCarrousel.push({
                // bypassSecurityTrustUrl to ignore warning in browser
                imageBase64: this.sanitizer.bypassSecurityTrustUrl(event.target.result),
                imageName: file.name // to find index on delete
            });
        };

        reader.readAsDataURL(file);
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

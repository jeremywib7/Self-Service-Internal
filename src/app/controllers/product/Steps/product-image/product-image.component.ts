import {Component, ElementRef, OnInit} from '@angular/core';
import {Product} from "../../../../model/Product";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {MessageService} from "primeng/api";
import {HttpEvent, HttpEventType, HttpParams} from "@angular/common/http";
import {ProductService} from "../../../../service/product.service";

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
        RxFormBuilder, private messageService: MessageService, private productService: ProductService) {

        this.productInfo = this.productModel.productInformation;

        if (this.productInfo.detailInformation.completed === false) {
            this.router.navigate(['pages/product']);
        }

    }

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    ngOnInit(): void {

        // check if edit mode
        let productFolderName = this.productModel.productInformation.detailInformation.name;
        let imageInformation = this.productModel.productInformation.imageInformation.imageName;

        if (this.router.url.includes("/edit")) {
            imageInformation.forEach((value, index, array) => {
                this.productModel.fileStatus.percent = 0;

                let params = new HttpParams();
                params = params.append('imageName', imageInformation[index].imageName);
                params = params.append('productName', productFolderName);

                this.productService.downloadProductImage(params).subscribe({
                    next: response => {
                        this.reportProgress(response);
                    }
                });

            });

        }
    }

    private reportProgress(httpEvent: HttpEvent<string[] | Blob>) {
        switch (httpEvent.type) {
            case HttpEventType.UploadProgress:
                this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading...');
                break;
            case HttpEventType.DownloadProgress:
                this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
                break;
            case HttpEventType.ResponseHeader:
                break;
            case HttpEventType.Response:

                if (httpEvent.body instanceof Array) {
                    this.productModel.fileStatus.status = 'done';
                    for (const filename of httpEvent.body) {
                        this.productModel.filenames.unshift(filename);
                    }
                } else {
                    // download logic
                    // set tsconfig.json strict: false or add ! in httpEven.body

                    // push into global file

                    this.productModel.pFileUploadProductImg.push(new File([httpEvent.body],
                        httpEvent.headers.get('File-Name'),
                        {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));

                    this.productModel.pFileUploadProductImg = [...this.productModel.pFileUploadProductImg];

                    // download as file
                    // saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
                    //     {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
                }
                this.productModel.fileStatus.status = 'done';
                break;
            default:
                break;
        }
    }

    private updateStatus(loaded: number, total: number, requestType: string) {
        this.productModel.fileStatus.status = 'progress';
        this.productModel.fileStatus.requestType = requestType;
        this.productModel.fileStatus.percent = Math.round(100 * loaded / total);
        console.log(this.productModel.fileStatus.percent);
    }

    displayMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    nextPage() {
        if (this.router.url.includes("/add")) {
            this.router.navigate(['pages/product/add/confirmation']).then();
        } else if (this.router.url.includes("/edit")) {
            this.router.navigate(['pages/product/edit/confirmation']).then();
        }
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

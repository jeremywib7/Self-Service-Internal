import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../../model/Product";
import {FormArray, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {MessageService} from "primeng/api";
import {HttpParams} from "@angular/common/http";
import {FileUpload} from "primeng/fileupload";

@Component({
    selector: 'app-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {

    productFg: FormGroup;

    editMode: boolean = false;

    constructor(public productModel: Product, private router: Router, private el: ElementRef, private rxFormBuilder:
        RxFormBuilder, private messageService: MessageService, private activatedRoute: ActivatedRoute) {
    }

    @ViewChild('fileUpload') fileUpload: FileUpload;

    apiBaseUrl = environment.apiBaseUrl;
    projectName = environment.project;

    ngOnInit(): void {
        this.initForm().then(() => {
                this.checkParamsExists();
            }
        );
    }

    async initForm() {
        this.productFg = this.rxFormBuilder.group({
            images: this.rxFormBuilder.array([{
                initialValue: [],
            }])
        });

        // clear initialization images name array
        this.productModel.imagesName = this.productFg.get('images') as FormArray;
        this.productModel.imagesName.removeAt(0);


        // if (this.productModel.selectedImage[0]) {
        //     this.productFg.controls['image'].setValue(this.productModel.selectedImage[0]);
        // }

    }

    addNewProductImage() {

        let lastIndex = this.productModel.imagesName.length - 1;
        const lastImageName = this.productModel.imagesName.value[lastIndex].imageName;

        if (this.productModel.imagesName.length < 3 && lastImageName) {
            this.productModel.imagesName.push(this.rxFormBuilder.group({
                imageName: ['', RxwebValidators.required()],
            }))

        } else if (!lastImageName) {
            this.displayMessage('error', 'No Image', 'Please add current image');
        } else if (this.productModel.imagesName.length === 3) {
            this.displayMessage('error', 'Maximum Image', 'You can only upload maximum 3 images');
        }
    }

    checkParamsExists() {
        // check if param id exists, then load data if true and set edit mode to true
        if (this.activatedRoute.snapshot.queryParams['i']) {
        } else {
            this.editMode = false;
            // add 1 value to the empty array
            this.productModel.imagesName.push(this.rxFormBuilder.group({
                imageName: ['', RxwebValidators.required()],
            }));

            // get uuid and path to form
            // this.productService.getUUID().subscribe(
            //     (data: object) => {
            //         const uuid = data['data']['uuid'];
            //         this.reactiveForm.patchValue({
            //             id: uuid,
            //         });
            //     },
            // );
        }
    }

    chooseLabel(index: number): string {
        let action = this.productModel.selectedImage[index] ? 'Change' : 'Choose';

        switch (index) {
            case 0: {
                return action + " First Image";
            }
            case 1: {
                return action + " Second Image";
            }
            case 2: {
                return action + " Third Image";
            }
            default: {
                return action + " Image";
            }
        }
    }

    displayMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    url: any[] = [];

    displayImageCarrousel(image) {
        const reader = new FileReader();

        let index = this.productModel.selectedImage.findIndex(image => image.name === image.name);

        reader.onload = (event: any) => {
            this.url[index] = event.target.result;
        };

        // reader.onerror = (event: any) => {
        //     console.log("File could not be read: " + event.target.error.code);
        // };

        reader.readAsDataURL(image)

        return this.url[index];

    }

    nextPage() {

        if (this.productFg.valid) {
            this.productModel.productInformation.imageInformation = this.productFg.value;
            this.router.navigate(['pages/product/add/confirmation']).then();
        } else {
            this.productFg.markAllAsTouched();
            this.validateFormFields(this.productFg);
        }

    }

    prevPage() {
        // this.productModel.productInformation.imageInformation = this.productFg.value;
        this.router.navigate(['pages/product/add/price']).then();
    }

    onSelectedImage(event: any): void {

        if (this.productModel.selectedImage.length <= 2) {
            this.productModel.selectedImage = this.fileUpload._files;
        }
        console.log(this.productModel.selectedImage);

    }

    onRemovedImage(event) {
        let index = this.productModel.selectedImage.findIndex(image => image.name === event.file.name);
        this.productModel.selectedImage.splice(index, 1);
        console.log(this.productModel.selectedImage);

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

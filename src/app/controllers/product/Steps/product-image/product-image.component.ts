import {Component, ElementRef, OnInit} from '@angular/core';
import {Product} from "../../../../model/Product";
import {FormArray, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {MessageService} from "primeng/api";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-product-image',
    templateUrl: './product-image.component.html',
    styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent implements OnInit {

    imageSrc: string[] = [];

    selectedImage: File[] = [];

    productFg: FormGroup;

    editMode: boolean = false;

    constructor(private productModel: Product, private router: Router, private el: ElementRef, private rxFormBuilder:
        RxFormBuilder, private messageService: MessageService, private activatedRoute: ActivatedRoute) {
    }

    images: FormArray;

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
        this.images = this.productFg.get('images') as FormArray;
        this.images.removeAt(0);
    }

    addNewProductImage() {
        let lastIndex = this.images.length - 1;
        const lastImageName = this.images.value[lastIndex].imageName;

        if (this.images.length < 3 && lastImageName) {
            this.images.push(this.rxFormBuilder.group({
                imageName: ['', RxwebValidators.required()],
            }))

        } else if (!lastImageName) {
            this.displayMessage('error', 'No Image', 'Please add current image');
        } else if (this.images.length === 3) {
            this.displayMessage('error', 'Maximum Image', 'You can only upload maximum 3 images');
        }
    }

    checkParamsExists() {
        // check if param id exists, then load data if true and set edit mode to true
        if (this.activatedRoute.snapshot.queryParams['i']) {
        } else {
            this.editMode = false;
            // add 1 value to the empty array
            this.images.push(this.rxFormBuilder.group({
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


    displayMessage(severity: string, summary: string, detail: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }

    checkAddProductImage(index, imageName) {
        if (this.imageSrc[index]) {
            return this.imageSrc[index];
        } else if (!this.imageSrc[index] && imageName) {
            return this.apiBaseUrl + '/' + this.projectName + '/images/product/download/' + imageName;
        } else if (!imageName) {
            return this.apiBaseUrl + '/' + this.projectName + '/images/product/download/' +
                'defaultproduct.jpg'
        }
        return null;
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

    onSelectedImage(event: any, index: number): void {
        // check if image not empty
        if (event.currentFiles && event.currentFiles[0]) {
            this.selectedImage[index] = event.currentFiles[0];
            (this.images.at(index) as FormGroup).get('imageName').patchValue(
                event.currentFiles[0].name);
            console.log(this.productFg.get('images').value);
        }
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

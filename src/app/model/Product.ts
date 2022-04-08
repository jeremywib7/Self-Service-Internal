import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {FormArray, FormGroup} from "@angular/forms";
import {ProductCarrousel} from "./ProductCarrousel";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";

@Injectable()
export class Product {

    id: string;
    name: string;
    discount: boolean;
    category: {
        id: string;
        categoryName: string;
    };
    totalCalories: string;
    description: string;
    active: boolean;
    unitPrice: number;
    discountedPrice: number;
    images: Image[];
    createdOn: Date;


    // for add or edit product steps

    productInformation = {
        detailInformation: {
            id: '',
            name: '',
            category: {
                id: '',
                categoryName: ''
            },
            totalCalories: null,
            description: '',
            completed: false,
        },
        priceInformation: {
            unitPrice: null,
            discount: '',
            discountPercent: null,
            sliderPercent: null,
            discountedPrice: null,
            completed: false,
        },
        imageInformation: {
            imageName: [],
        },
    };

    //


    // reset add or edit product steps

    resetProductInformation = {
        detailInformation: {
            id: '',
            name: '',
            category: {
                id: '',
                categoryName: ''
            },
            totalCalories: null,
            description: '',
            completed: false,
        },
        priceInformation: {
            unitPrice: null,
            discount: '',
            discountPercent: null,
            sliderPercent: null,
            discountedPrice: null,
            completed: false,
        },
        imageInformation: {
            imageName: [],
        },
    };

    resetAddOrEditProductSteps() {
        // reset global state
        this.productInformation.detailInformation = this.resetProductInformation.detailInformation;
        this.productInformation.priceInformation = this.resetProductInformation.priceInformation;
        this.productInformation.imageInformation = this.resetProductInformation.imageInformation;

        // reset list of file to be displayed in p-file-upload
        this.pFileUploadProductImg = [];

        // reset list of image properties
        this.productCarrousel = [];

        // reset previous image length
        this.previousImageFileLength = -1;
    }


    // array of categories

    categoryDropdown = {
        category: []
    }


    // for carousel or display array of images

    productCarrousel: ProductCarrousel[] = [];

    pFileUploadProductImg: File[] = []; // list of image file

    previousImageFileLength: number = -1; // if there is difference with previous image length then it is true condition


    // on complete add or edit product steps

    private addOrEditCompleteProduct = new Subject<any>();

    addOrEditCompleteProduct$ = this.addOrEditCompleteProduct.asObservable();

    complete() {
        this.addOrEditCompleteProduct.next(this.productInformation);
    }

}

export interface Image {
    imageName: string;
}

export interface Pagination {
    totalElements: number;
    numberOfElements: number;
    size: number;
    totalPages: number;
    pageable: {
        pageNumber: number;
    },
    links: {
        first: string,
        previous: string,
        next: string,
        last: string
    }
}

import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {FormArray, FormGroup} from "@angular/forms";
import {ProductCarrousel} from "./ProductCarrousel";
import {RxFormBuilder} from "@rxweb/reactive-form-validators";
import {FileStatus} from "../FileStatus";

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
        },
        priceInformation: {
            unitPrice: null,
            discount: null,
            discountedPrice: null,
        },
        imageInformation: {
            imageName: [],
        },
    };

    // for download image as a file
    filenames: string[] = [];
    fileStatus: FileStatus = new FileStatus();

    // discount price state
    discountPercent: number = null;
    sliderPercent: number = null;

    // to allow load confirmation page if all
    detailInformationDone: boolean = false;
    priceInformationDone: boolean = false;


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
        },
        priceInformation: {
            unitPrice: null,
            discount: '',
            discountedPrice: null,
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

        // reset list of image properties to be displayed in carrousel confirmation
        this.productCarrousel = [];

        // reset previous image length
        this.previousImageFileLength = -1;

        // reset slider in discount percentage
        this.discountPercent = 0;
        this.sliderPercent = 0;

        // reset done status to false
        this.detailInformationDone = false;
        this.priceInformationDone = false;
    }


    // array of categories
    categoryDropdown = {
        category: []
    }

    productCarrousel: ProductCarrousel[] = []; // for carousel or display array of images

    pFileUploadProductImg: File[] = []; // list of image file in p file upload

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

// for lazy loading

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

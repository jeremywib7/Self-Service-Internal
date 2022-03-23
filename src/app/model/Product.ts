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


    // for steps

    productInformation = {
        detailInformation: {
            id: '',
            name: '',
            category: {
                id: '',
                categoryName: ''
            },
            totalCalories: 0,
            description: '',
            completed: false,
        },
        priceInformation: {
            unitPrice: 0,
            discount: '',
            discountPercent: 0,
            sliderPercent: 0,
            discountedPrice: 0,
            completed: false,
        },
        imageInformation: {
            imageName: [],
        },
    };

    // array of categories

    categoryDropdown = {
        category: []
    }


    // for carousel or display array of images

    productCarrousel: ProductCarrousel[] = [];

    pFileUploadProductImg: File[] = []; // list of image file

    previousImageFileLength: number = -1; // if there is difference with previous image length then it is true condition


    // on complete steps

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

import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {FormArray} from "@angular/forms";

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
                categoryName:''
            },
            totalCalories: '',
            description: ''
        },
        priceInformation: {
            unitPrice: '',
            discount: '',
            discountPercent: '',
            sliderPercent: '',
            discountedPrice: '',
        },
        imageInformation: {
            images: [],
        }
    };

    selectedImage: File[] = []; // list of file
    imagesName: FormArray; // form name array
    imageSrc: string[] = []; // for image preview

    private addOrEditComplete = new Subject<any>();

    addOrEditComplete$ = this.addOrEditComplete.asObservable();

    complete() {
        this.addOrEditComplete.next(this.productInformation);
    }

    // array of categories

    categoryDropdown = {
        category: []
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

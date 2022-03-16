import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

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
            },
            totalCalories: '',
            description: ''
        },
        priceInformation: {
            unitPrice: '',
            discountedPrice: '',
        },
        imageInformation: {
            images: [],
        }
    };

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

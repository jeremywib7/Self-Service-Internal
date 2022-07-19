export interface Pagination {
    content: any[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: PageableChild;
    sort: SortChild;
    totalElements: number;
    totalPages: number;
}

interface PageableChild {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: SortChild;
    unpaged: boolean;
    size: number;
}

interface SortChild {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

import {Product} from "./Product";

export class ProductCategory {
  id: string;
  categoryName: string;
  createdOn: string;
  updatedOn: string;
  totalProduct; number;
  products: Product[];
}

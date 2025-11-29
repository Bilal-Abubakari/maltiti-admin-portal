// filepath: c:\Users\BilalAbubakari\Desktop\PROJECTS\maltiti-admin-portal\src\app\features\products\types\product-form-value.type.ts

import {
  PackagingSize,
  ProductCategory,
  ProductGrade,
  ProductStatus,
} from '../models/product.model';
import { FormControl, FormGroup } from '@angular/forms';

export interface ProductFormValue {
  name: string | null;
  sku: string | null;
  description: string | null;
  category: ProductCategory | null;
  status: ProductStatus | null;
  wholesale: number | null;
  retail: number | null;
  inBoxPrice: number | null;
  costPrice: number | null;
  stockQuantity: number | null;
  quantityInBox: number | null;
  minOrderQuantity: number | null;
  size: PackagingSize | null;
  grade: ProductGrade | null;
  weight: string | null;
  ingredients: string[] | null;
  isFeatured: boolean | null;
  isOrganic: boolean | null;
  producedAt: Date | null;
  expiryDate: Date | null;
  images: string[] | null;
  image: string | null;
  supplierReference: string | null;
  certifications: string[] | null;
}

export type ProductFormGroup = FormGroup<{
  name: FormControl<string | null>;
  sku: FormControl<string | null>;
  description: FormControl<string | null>;
  category: FormControl<ProductCategory | null>;
  status: FormControl<ProductStatus | null>;
  wholesale: FormControl<number | null>;
  retail: FormControl<number | null>;
  inBoxPrice: FormControl<number | null>;
  costPrice: FormControl<number | null>;
  stockQuantity: FormControl<number | null>;
  quantityInBox: FormControl<number | null>;
  minOrderQuantity: FormControl<number | null>;
  size: FormControl<PackagingSize | null>;
  grade: FormControl<ProductGrade | null>;
  weight: FormControl<string | null>;
  ingredients: FormControl<string[] | null>;
  isFeatured: FormControl<boolean | null>;
  isOrganic: FormControl<boolean | null>;
  producedAt: FormControl<Date | null>;
  expiryDate: FormControl<Date | null>;
  images: FormControl<string[] | null>;
  image: FormControl<string | null>;
  supplierReference: FormControl<string | null>;
  certifications: FormControl<string[] | null>;
}>;

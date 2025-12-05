/**
 * Product domain models based on Swagger API documentation
 * These models represent the Product entity and its related DTOs
 */
import { Ingredient } from '@models/ingredient.model';

export type ProductCategory =
  | 'Shea Butter'
  | 'Black Soap'
  | 'Cosmetics'
  | 'Shea Soap'
  | 'Powdered Soap'
  | 'Dawadawa Tea'
  | 'Essential Oils'
  | 'Hair Oil'
  | 'Grains'
  | 'Legumes'
  | 'Other';

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';

export type ProductGrade = 'A' | 'B' | 'premium' | 'standard' | 'organic';

export type PackagingSize =
  | '100g'
  | '250g'
  | '500g'
  | '1kg'
  | '5kg'
  | '12kg'
  | '25kg'
  | '50kg'
  | '100ml'
  | '250ml'
  | '500ml'
  | '1L'
  | 'custom';

export interface Product {
  id: string;
  sku: string;
  name: string;
  ingredients: Ingredient[];
  weight: string;
  category: ProductCategory;
  description: string;
  status: ProductStatus;
  size: PackagingSize;
  images: string[];
  image: string;
  wholesale: number;
  retail: number;
  stockQuantity: number;
  inBoxPrice: number;
  quantityInBox: number;
  favorite: boolean;
  rating: number;
  reviews: number;
  grade: ProductGrade;
  isFeatured: boolean;
  isOrganic: boolean;
  certifications: string[];
  supplierReference: string;
  producedAt: string;
  expiryDate: string;
  minOrderQuantity: number;
  costPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export type LightProduct = Pick<Product, 'id' | 'name' | 'wholesale' | 'retail'>;

export interface CreateProductDto {
  sku?: string;
  name: string;
  ingredients: string[];
  weight?: string;
  category: ProductCategory;
  description: string;
  status?: ProductStatus;
  size?: PackagingSize;
  images?: string[];
  image?: string;
  wholesale: number;
  retail: number;
  stockQuantity: number;
  inBoxPrice?: number;
  quantityInBox?: number;
  grade?: ProductGrade;
  isFeatured?: boolean;
  isOrganic?: boolean;
  certifications?: string[];
  supplierReference?: string;
  producedAt?: string;
  expiryDate?: string;
  minOrderQuantity?: number;
  costPrice?: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  grade?: ProductGrade;
  packagingSize?: PackagingSize;
  isFeatured?: boolean;
  isOrganic?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'retail' | 'createdAt' | 'rating' | 'stockQuantity';
  sortOrder?: 'ASC' | 'DESC';
}

export interface BestProductsResponse {
  totalItems: number;
  data: Product[];
}

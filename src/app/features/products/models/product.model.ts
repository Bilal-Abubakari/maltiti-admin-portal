/**
 * Product domain models based on Swagger API documentation
 * These models represent the Product entity and its related DTOs
 */

export type ProductCategory =
  | 'shea_butter'
  | 'black_soap'
  | 'cosmetics'
  | 'shea_soap'
  | 'powdered_soap'
  | 'dawadawa_tea'
  | 'essential_oils'
  | 'hair_oil'
  | 'grains'
  | 'legumes'
  | 'other';

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
  ingredients: string[];
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
  createdAt: string;
  updatedAt: string;
}

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
  batchId?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isMinorUpdate?: boolean;
}

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
  batchId?: string;
}

export interface BestProductsResponse {
  totalItems: number;
  data: Product[];
}

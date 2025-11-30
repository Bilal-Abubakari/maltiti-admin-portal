/**
 * Batch domain models based on Swagger API documentation
 * These models represent the Batch entity for product batch tracking
 */
import { Product } from '../../products/models/product.model';

export interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
  products?: Product[]; // Products associated with this batch
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchDto {
  batchNumber: string;
  productId: string;
  quantity: number;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
}

export type UpdateBatchDto = {} & Partial<CreateBatchDto>;

export interface BatchQueryParams {
  page?: number;
  limit?: number;
  productId?: string;
  batchNumber?: string;
  qualityCheckStatus?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'batchNumber' | 'productionDate' | 'expiryDate';
  sortOrder?: 'ASC' | 'DESC';
}

export interface BatchesPaginationResponse {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  batches: Batch[];
}

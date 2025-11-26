/**
 * Batch domain models based on Swagger API documentation
 * These models represent the Batch entity for product batch tracking
 */
import { Product } from '../../products/models/product.model';

export type Batch = {
  id: string;
  batchNumber: string;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
  products?: Product[]; // Products associated with this batch
  createdAt: string;
  updatedAt: string;
};

export type CreateBatchDto = {
  batchNumber: string;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
};

export type UpdateBatchDto = {} & Partial<CreateBatchDto>;

export type BatchQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  qualityCheckStatus?: string;
  sortBy?: 'batchNumber' | 'productionDate' | 'expiryDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
};

export type BatchesPaginationResponse = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  batches: Batch[];
};

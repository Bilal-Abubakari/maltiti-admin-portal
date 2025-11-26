/**
 * Batch domain models based on Swagger API documentation
 * These models represent the Batch entity for product batch tracking
 */

export interface Batch {
  id: string;
  batchNumber: string;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
  products?: any[]; // Products associated with this batch
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchDto {
  batchNumber: string;
  productionDate?: string;
  expiryDate?: string;
  manufacturingLocation?: string;
  qualityCheckStatus?: string;
  notes?: string;
}

export interface UpdateBatchDto extends Partial<CreateBatchDto> {}

export interface BatchQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  qualityCheckStatus?: string;
  sortBy?: 'batchNumber' | 'productionDate' | 'expiryDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface BatchesPaginationResponse {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  batches: Batch[];
}

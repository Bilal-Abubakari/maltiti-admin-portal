import { User } from '@models/user.model';
import { Product } from '../../products/models/product.model';

export enum SaleStatus {
  InvoiceRequested = 'invoice_requested',
  PendingPayment = 'pending_payment',
  Paid = 'paid',
  Packaging = 'packaging',
  InTransit = 'in_transit',
  Delivered = 'delivered',
}

export interface BatchAllocationDto {
  batch_id: string;
  quantity: number;
}

export interface SaleLineItemDto {
  product_id: string;
  batch_allocations: BatchAllocationDto[];
  requested_quantity: number;
  custom_price?: number;
}

export interface CreateSaleDto {
  customer_id: string;
  status?: SaleStatus;
  line_items: SaleLineItemDto[];
}

export interface UpdateSaleLineItemDto {
  product_id?: string;
  batch_allocations?: BatchAllocationDto[];
  requested_quantity?: number;
  custom_price?: number;
}

export interface UpdateSaleDto {
  customer_id?: string;
  line_items?: UpdateSaleLineItemDto[];
}

export interface UpdateSaleStatusDto {
  status: SaleStatus;
}

export interface AddLineItemDto {
  product_id: string;
  batch_allocations: BatchAllocationDto[];
  requested_quantity: number;
  custom_price?: number;
}

export interface AssignBatchesDto {
  product_id: string;
  batch_allocations: BatchAllocationDto[];
}

export interface GenerateInvoiceDto {
  discount?: number;
  transportation?: number;
}

export interface SaleLineItem {
  id: string;
  product_id: string;
  product?: Product; // Assuming product model exists
  batch_allocations: BatchAllocationDto[];
  requested_quantity: number;
  custom_price?: number;
  final_price?: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  customer?: User;
  status: SaleStatus;
  line_items: SaleLineItem[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

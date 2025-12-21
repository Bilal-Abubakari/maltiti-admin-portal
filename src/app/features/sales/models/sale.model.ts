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
  batchId: string;
  quantity: number;
}

export interface SaleLineItemDto {
  productId: string;
  batchAllocations: BatchAllocationDto[];
  requestedQuantity: number;
  customPrice?: number;
}

export interface CreateSaleDto {
  customerId: string;
  status?: SaleStatus;
  lineItems: SaleLineItemDto[];
}

export interface UpdateSaleLineItemDto {
  productId?: string;
  batchAllocations?: BatchAllocationDto[];
  requestedQuantity?: number;
  customPrice?: number;
}

export interface UpdateSaleDto {
  customerId?: string;
  status?: SaleStatus;
  lineItems?: UpdateSaleLineItemDto[];
}

export interface UpdateSaleStatusDto {
  status: SaleStatus;
}

export interface AssignBatchesDto {
  productId: string;
  batchAllocations: BatchAllocationDto[];
}

export interface GenerateInvoiceDto {
  discount?: number;
  transportation?: number;
}

export interface GenerateReceiptDto {
  paymentMethod?: string;
  discount?: number;
  transportation?: number;
}

export interface SaleLineItem {
  id: string;
  productId: string;
  product?: Product;
  batchAllocations: BatchAllocationDto[];
  requestedQuantity: number;
  customPrice?: number;
  finalPrice?: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  customerId: string;
  customer?: User;
  status: SaleStatus;
  lineItems: SaleLineItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

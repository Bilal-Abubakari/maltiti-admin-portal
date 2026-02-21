import { SaleLineItemDto } from '@features/sales/models/sale.model';

export const lineItemTotalPrice = (lineItem: SaleLineItemDto): number => {
  const quantity = lineItem.requestedQuantity;
  const price = lineItem.customPrice || lineItem.finalPrice || 0;

  return quantity * price;
};

export const lineItemsTotalPrice = (lineItems: SaleLineItemDto[]): number => {
  return lineItems.reduce((acc, lineItem) => acc + lineItemTotalPrice(lineItem), 0);
};

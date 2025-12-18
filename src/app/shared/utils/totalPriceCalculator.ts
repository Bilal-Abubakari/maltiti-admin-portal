import { SaleLineItem } from '@features/sales/models/sale.model';

export const lineItemTotalPrice = (lineItem: SaleLineItem): number => {
  const quantity = lineItem.requestedQuantity;
  const price = lineItem.customPrice || lineItem.finalPrice || 0;

  return quantity * price;
};

export const lineItemsTotalPrice = (lineItems: SaleLineItem[]): number => {
  return lineItems.reduce((acc, lineItem) => acc + lineItemTotalPrice(lineItem), 0);
};

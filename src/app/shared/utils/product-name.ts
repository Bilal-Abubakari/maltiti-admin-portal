import { LightProduct, Product } from '@features/products/models/product.model';
import { unitSymbols } from '@shared/constants';

export const productName = (product: Product | LightProduct | null | undefined): string => {
  if (!product) {
    return 'N/A';
  }

  const { name, weight, unitOfMeasurement } = product;

  // If no weight or unit, return just the name
  if (!weight || !unitOfMeasurement) {
    return name;
  }

  // Get unit symbol
  const unitSymbol = unitSymbols[unitOfMeasurement] || unitOfMeasurement;

  // Format: "Name (weight unit)"
  return `${name} (${weight}${unitSymbol})`;
};

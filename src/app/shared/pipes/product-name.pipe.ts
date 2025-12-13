/**
 * Product Name Pipe
 * Formats product name with weight and unit of measurement symbol
 * Example: "Shea Butter (500g)"
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Product, UnitOfMeasurement } from '@features/products/models/product.model';

@Pipe({
  name: 'productName',
  standalone: true,
})
export class ProductNamePipe implements PipeTransform {
  private readonly unitSymbols: Record<UnitOfMeasurement, string> = {
    [UnitOfMeasurement.KILOGRAM]: 'kg',
    [UnitOfMeasurement.GRAM]: 'g',
    [UnitOfMeasurement.LITRE]: 'L',
    [UnitOfMeasurement.MILLILITRE]: 'ml',
  };

  public transform(product: Product | null | undefined): string {
    if (!product) {
      return 'N/A';
    }

    const { name, weight, unitOfMeasurement } = product;

    // If no weight or unit, return just the name
    if (!weight || !unitOfMeasurement) {
      return name;
    }

    // Get unit symbol
    const unitSymbol = this.unitSymbols[unitOfMeasurement] || unitOfMeasurement;

    // Format: "Name (weight unit)"
    return `${name} (${weight}${unitSymbol})`;
  }
}

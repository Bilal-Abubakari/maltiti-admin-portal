/**
 * Product Name Pipe
 * Formats product name with weight and unit of measurement symbol
 * Example: "Shea Butter (500g)"
 */

import { Pipe, PipeTransform } from '@angular/core';
import { LightProduct, Product } from '@features/products/models/product.model';
import { productName } from '@shared/utils/product-name';

@Pipe({
  name: 'productName',
  standalone: true,
})
export class ProductNamePipe implements PipeTransform {
  public transform(product: Product | null | undefined | LightProduct): string {
    return productName(product);
  }
}

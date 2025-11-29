/**
 * Product Constants
 * Contains all option arrays and constants used across product-related components
 */

// Product Categories
export const PRODUCT_CATEGORIES = [
  { label: 'Shea Butter', value: 'Shea Butter' },
  { label: 'Black Soap', value: 'Black Soap' },
  { label: 'Cosmetics', value: 'Cosmetics' },
  { label: 'Shea Soap', value: 'Shea Soap' },
  { label: 'Powdered Soap', value: 'Powdered Soap' },
  { label: 'Dawadawa Tea', value: 'Dawadawa Tea' },
  { label: 'Essential Oils', value: 'Essential Oils' },
  { label: 'Hair Oil', value: 'Hair Oil' },
  { label: 'Grains', value: 'Grains' },
  { label: 'Legumes', value: 'Legumes' },
  { label: 'Other', value: 'Other' },
];

// Product Status Options
export const PRODUCT_STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Discontinued', value: 'discontinued' },
];

// Product Grade Options
export const PRODUCT_GRADE_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'Premium', value: 'premium' },
  { label: 'Standard', value: 'standard' },
  { label: 'Organic', value: 'organic' },
];

// Packaging Size Options
export const PACKAGING_SIZE_OPTIONS = [
  { label: '100g', value: '100g' },
  { label: '250g', value: '250g' },
  { label: '500g', value: '500g' },
  { label: '1kg', value: '1kg' },
  { label: '5kg', value: '5kg' },
  { label: '12kg', value: '12kg' },
  { label: '25kg', value: '25kg' },
  { label: '50kg', value: '50kg' },
  { label: '100ml', value: '100ml' },
  { label: '250ml', value: '250ml' },
  { label: '500ml', value: '500ml' },
  { label: '1L', value: '1L' },
  { label: 'Custom', value: 'custom' },
];

// Ingredient Options
export const INGREDIENT_OPTIONS = [
  'Shea Butter',
  'Black Soap',
  'Essential Oils',
  'Herbs',
  'Natural Extracts',
  'Vegetable Oil',
  'Coconut Oil',
  'Palm Oil',
  'Aloe Vera',
  'Honey',
  'Lemon',
  'Ginger',
  'Turmeric',
  'Other',
];

// Certification Options
export const CERTIFICATION_OPTIONS = [
  'Organic Certified',
  'Fair Trade',
  'Vegan',
  'Cruelty Free',
  'Halal',
  'Kosher',
  'ISO 9001',
  'GMP Certified',
];

// Type exports for better TypeScript support
export type ProductCategoryOption = (typeof PRODUCT_CATEGORIES)[number];
export type ProductStatusOption = (typeof PRODUCT_STATUS_OPTIONS)[number];
export type ProductGradeOption = (typeof PRODUCT_GRADE_OPTIONS)[number];
export type PackagingSizeOption = (typeof PACKAGING_SIZE_OPTIONS)[number];
export type IngredientOption = (typeof INGREDIENT_OPTIONS)[number];
export type CertificationOption = (typeof CERTIFICATION_OPTIONS)[number];

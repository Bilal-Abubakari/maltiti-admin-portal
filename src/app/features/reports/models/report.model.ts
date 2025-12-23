/**
 * Report Models and DTOs
 * Based on Swagger API documentation for Reports endpoints
 */

/**
 * Common query parameters for reports
 */
export interface ReportQueryParams {
  fromDate?: string;
  toDate?: string;
  productId?: string;
  category?: ProductCategory;
  batchId?: string;
  aggregation?: AggregationLevel;
  includeTrends?: boolean;
  [key: string]: string | boolean | number | ProductCategory | AggregationLevel | undefined;
}

/**
 * Inventory-specific query parameters
 */
export interface InventoryQueryParams {
  category?: ProductCategory;
  productId?: string;
  lowStockOnly?: boolean;
  lowStockThreshold?: number;
  [key: string]: string | boolean | number | ProductCategory | undefined;
}

/**
 * Comparative report query parameters
 */
export interface ComparativeQueryParams {
  currentFromDate: string;
  currentToDate: string;
  previousFromDate: string;
  previousToDate: string;
  category?: ProductCategory;
  [key: string]: string | ProductCategory | undefined;
}

/**
 * Top products query parameters
 */
export interface TopProductsQueryParams extends ReportQueryParams {
  limit?: number;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Product categories enum
 */
export type ProductCategory =
  | 'Shea Butter'
  | 'Black Soap'
  | 'Cosmetics'
  | 'Shea Soap'
  | 'Powdered Soap'
  | 'Dawadawa'
  | 'Essential Oils'
  | 'Hair Oil'
  | 'Grains'
  | 'Legumes'
  | 'Other';

/**
 * Time aggregation levels
 */
export type AggregationLevel = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Sales Report Response
 */
export interface SalesReport {
  totalRevenue: number;
  salesCount: number;
  averageOrderValue: number;
  timeSeries?: TimeSeriesDataPoint[];
  trends?: SalesTrends;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string;
  revenue: number;
  salesCount: number;
  averageOrderValue?: number;
}

/**
 * Sales trends
 */
export interface SalesTrends {
  revenueGrowth: number;
  salesGrowth: number;
  averageOrderValueGrowth: number;
}

/**
 * Sales by Product Response
 */
export interface SalesByProductReport {
  products: ProductSalesData[];
  totalRevenue: number;
  totalQuantitySold: number;
}

/**
 * Product sales data
 */
export interface ProductSalesData {
  productId: string;
  productName: string;
  category: ProductCategory;
  quantitySold: number;
  revenue: number;
  salesCount: number;
  averagePrice: number;
}

/**
 * Sales by Category Response
 */
export interface SalesByCategoryReport {
  categories: CategorySalesData[];
  totalRevenue: number;
}

/**
 * Category sales data
 */
export interface CategorySalesData {
  category: ProductCategory;
  revenue: number;
  quantitySold: number;
  salesCount: number;
  percentageOfTotal: number;
}

/**
 * Top Products Response
 */
export interface TopProductsReport {
  products: ProductSalesData[];
  totalProducts: number;
}

/**
 * Revenue Distribution Response
 */
export interface RevenueDistributionReport {
  distribution: RevenueDistributionData[];
  totalRevenue: number;
}

/**
 * Revenue distribution data
 */
export interface RevenueDistributionData {
  productId: string;
  productName: string;
  revenue: number;
  percentageOfTotal: number;
}

/**
 * Batch Report Response
 */
export interface BatchReport {
  batches: BatchProductionData[];
  summary: BatchSummary;
}

/**
 * Batch production data
 */
export interface BatchProductionData {
  batchId: string;
  batchNumber: string;
  productId: string;
  productName: string;
  productionDate: string;
  quantityProduced: number;
  quantitySold: number;
  quantityRemaining: number;
  utilizationRate: number;
}

/**
 * Batch summary
 */
export interface BatchSummary {
  totalBatches: number;
  totalProduced: number;
  totalSold: number;
  totalRemaining: number;
  averageUtilizationRate: number;
}

/**
 * Batch Aging Report Response
 */
export interface BatchAgingReport {
  batches: BatchAgingData[];
  summary: BatchAgingSummary;
}

/**
 * Batch aging data
 */
export interface BatchAgingData {
  batchId: string;
  batchNumber: string;
  productName: string;
  productionDate: string;
  expiryDate: string;
  ageInDays: number;
  daysUntilExpiry: number;
  quantityRemaining: number;
  urgencyLevel: 'critical' | 'warning' | 'normal';
}

/**
 * Batch aging summary
 */
export interface BatchAgingSummary {
  totalBatches: number;
  criticalBatches: number;
  warningBatches: number;
  normalBatches: number;
}

/**
 * Inventory Report Response
 */
export interface InventoryReport {
  items: InventoryData[];
  summary: InventorySummary;
}

/**
 * Inventory data
 */
export interface InventoryData {
  productId: string;
  productName: string;
  category: ProductCategory;
  currentStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  inventoryValue: number;
  unitPrice: number;
}

/**
 * Inventory summary
 */
export interface InventorySummary {
  totalProducts: number;
  totalStockValue: number;
  lowStockItems: number;
  totalUnits: number;
}

/**
 * Stock Movement Report Response
 */
export interface StockMovementReport {
  movements: StockMovementData[];
  summary: StockMovementSummary;
}

/**
 * Stock movement data
 */
export interface StockMovementData {
  date: string;
  productId?: string;
  productName?: string;
  production: number;
  sales: number;
  netMovement: number;
  closingStock: number;
}

/**
 * Stock movement summary
 */
export interface StockMovementSummary {
  totalProduction: number;
  totalSales: number;
  netMovement: number;
}

/**
 * Comparative Report Response
 */
export interface ComparativeReport {
  currentPeriod: PeriodData;
  previousPeriod: PeriodData;
  comparison: ComparisonData;
}

/**
 * Period data
 */
export interface PeriodData {
  fromDate: string;
  toDate: string;
  revenue: number;
  salesCount: number;
  averageOrderValue: number;
  topProducts: ProductSalesData[];
}

/**
 * Comparison data
 */
export interface ComparisonData {
  revenueGrowth: number;
  revenueGrowthPercentage: number;
  salesGrowth: number;
  salesGrowthPercentage: number;
  averageOrderValueGrowth: number;
  averageOrderValueGrowthPercentage: number;
}

/**
 * Dashboard Summary Response
 */
export interface DashboardSummary {
  sales: {
    totalRevenue: number;
    salesCount: number;
    averageOrderValue: number;
    revenueGrowth?: number;
  };
  inventory: {
    totalProducts: number;
    totalStockValue: number;
    lowStockItems: number;
  };
  production: {
    totalBatches: number;
    totalProduced: number;
    averageUtilizationRate: number;
  };
  topProducts: ProductSalesData[];
}

/**
 * Report card configuration for reports hub
 */
export interface ReportCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

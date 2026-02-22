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
  fromDate?: string;
  toDate?: string;
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
export interface SalesSummary {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  totalQuantitySold: number;
}

export interface TimeSeriesItem {
  /**
   * Format: YYYY-MM (e.g. "2026-01")
   */
  date: string;
  revenue: number;
  salesCount: number;
}

export interface SalesTrends {
  revenueGrowth: number;
  salesGrowth: number;
  averageOrderValueGrowth: number;
}

export interface SalesReport {
  summary: SalesSummary;
  timeSeries: TimeSeriesItem[];
  trends: SalesTrends;
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
  totalQuantitySold: number;
  totalRevenue: number;
  numberOfSales: number;
  rank: number;
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
  topProducts: ProductSalesData[];
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
  initialQuantity: number;
  soldQuantity: number;
  remainingQuantity: number;
  expiryDate: string;
  soldPercentage: number;
  isActive: boolean;
  daysUntilExpiry: number;
  // utilizationRate: number;
}

/**
 * Batch summary
 */
export interface BatchSummary {
  totalBatches: number;
  totalProduction: number;
  totalSold: number;
  totalRemaining: number;
  averageUtilization: number;
}

/**
 * Batch Aging Report Response
 */
export interface BatchAgingReport {
  batches: BatchAgingData[];
  summary: BatchAgingSummary;
}

export type Status = 'fresh' | 'aging' | 'critical' | 'expired';

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
  remainingQuantity: number;
  status: Status;
}

/**
 * Batch aging summary
 */
export interface BatchAgingSummary {
  totalBatches: number;
  criticalBatches: number;
  expiredBatches: number;
  freshBatches: number;
  agingBatches: number;
}

/**
 * Inventory Report Response
 */
export interface InventoryReport {
  inventory: InventoryData[];
  summary: InventorySummary;
}

/**
 * Inventory data
 */
export interface InventoryData {
  productId: string;
  productName: string;
  category: ProductCategory;
  newestBatchDate: string;
  numberOfBatches: number;
  oldestBatchDate: string;
  totalStock: number;
  totalValue: number;
  isLowStock: boolean;
}

/**
 * Inventory summary
 */
export interface InventorySummary {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  totalStockQuantity: number;
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
  produced: number;
  sold: number;
  netChange: number;
  closingStock: number;
}

/**
 * Stock movement summary
 */
export interface StockMovementSummary {
  totalProduced: number;
  totalSold: number;
  netChange: number;
  currentStock: number;
}

/**
 * Comparative Report Response
 */
export interface ComparativeReport {
  current: PeriodData;
  previous: PeriodData;
  growth: ComparisonData;
}

/**
 * Period data
 */
export interface PeriodData {
  averageOrderValue: number;
  totalSales: number;
  totalRevenue: number;
  totalQuantitySold: number;
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

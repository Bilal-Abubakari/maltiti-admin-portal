/**
 * Dashboard Models and DTOs
 * Based on Swagger API documentation for Dashboard endpoints
 */

/**
 * Dashboard Summary Query Parameters
 */
export interface DashboardSummaryParams {
  fromDate?: string;
  toDate?: string;
  includeComparison?: boolean;
  [key: string]: string | boolean | undefined;
}

/**
 * Dashboard Trends Query Parameters
 */
export interface DashboardTrendsParams {
  period?: '7' | '30' | '90';
  [key: string]: string | undefined;
}

/**
 * Dashboard Highlights Query Parameters
 */
export interface DashboardHighlightsParams {
  limit?: number;
  [key: string]: number | undefined;
}

/**
 * Dashboard Alerts Query Parameters
 */
export interface DashboardAlertsParams {
  lowStockThreshold?: number;
  expiryWarningDays?: number;
  [key: string]: number | undefined;
}

/**
 * Dashboard Activity Query Parameters
 */
export interface DashboardActivityParams {
  limit?: number;
  [key: string]: number | undefined;
}

/**
 * Dashboard Summary Response - Main KPI metrics
 */
export interface DashboardSummary {
  totalRevenue: number;
  totalSales: number;
  inventoryValue: number;
  unsoldStock: number;
  totalProducts: number;
  totalBatches: number;
  comparison?: {
    revenueGrowth: number;
    salesGrowth: number;
    inventoryGrowth: number;
  };
}

/**
 * Trend Data Point
 */
export interface TrendDataPoint {
  date: string;
  revenue: number;
  sales: number;
  production?: number;
}

/**
 * Dashboard Trends Response
 */
export interface DashboardTrends {
  period: string;
  trends: TrendDataPoint[];
  summary: {
    totalRevenue: number;
    totalSales: number;
    totalProduction: number;
    averageDaily: number;
  };
}

/**
 * Product Highlight (Top/Bottom Performer)
 */
export interface ProductHighlight {
  productId: string;
  productName: string;
  category: string;
  revenue: number;
  quantitySold: number;
  salesCount: number;
  growthRate?: number;
}

/**
 * Dashboard Highlights Response
 */
export interface DashboardHighlights {
  topSellers: ProductHighlight[];
  bottomPerformers: ProductHighlight[];
  fastestGrowing: ProductHighlight[];
  declining: ProductHighlight[];
}

/**
 * Alert Severity Levels
 */
export type AlertSeverity = 'critical' | 'warning' | 'info';

/**
 * Low Stock Alert
 */
export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: AlertSeverity;
}

/**
 * Batch Expiry Alert
 */
export interface BatchExpiryAlert {
  batchId: string;
  batchNumber: string;
  productName: string;
  expiryDate: string;
  daysUntilExpiry: number;
  quantityRemaining: number;
  severity: AlertSeverity;
}

/**
 * Dashboard Alerts Response
 */
export interface DashboardAlerts {
  lowStockAlerts: LowStockAlert[];
  expiringBatches: BatchExpiryAlert[];
  totalAlerts: number;
  criticalCount: number;
  warningCount: number;
}

/**
 * Recent Sale Activity
 */
export interface RecentSale {
  id: string;
  saleNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

/**
 * Recent Batch Activity
 */
export interface RecentBatch {
  id: string;
  batchNumber: string;
  productName: string;
  quantity: number;
  productionDate: string;
  createdAt: string;
}

/**
 * Recent Inventory Change
 */
export interface RecentInventoryChange {
  id: string;
  productName: string;
  changeType: 'production' | 'sale' | 'adjustment';
  quantityChange: number;
  timestamp: string;
}

/**
 * Dashboard Activity Response
 */
export interface DashboardActivity {
  recentSales: RecentSale[];
  recentBatches: RecentBatch[];
  recentInventoryChanges: RecentInventoryChange[];
}

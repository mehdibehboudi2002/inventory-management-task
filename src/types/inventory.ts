export interface Product {
    id: number | string;
    sku: string;
    name: string;
    category: string;
    unitCost: number;
    reorderPoint: number;
}

export interface Warehouse {
    id: number | string;
    code: string;
    name: string;
    location: string;
}

export interface StockItem {
    id: number | string;
    productId: string;
    warehouseId: string;
    quantity: number;
}

export interface InventoryOverviewItem extends Product {
    totalQuantity: number;
    status: string;
    statusColor: "error" | "warning" | "success" | "info";
    percentOfReorder: number;
}

export interface ChartDataItem {
    name: string;
    value: number;
    fullName?: string;
    color?: string;
    [key: string]: string | number | undefined;
}

export interface DashboardMetrics {
    totalValue: number;
    lowStockCount: number;
    warehouseData: ChartDataItem[];
    categoryData: ChartDataItem[];
    stockStatusData: ChartDataItem[];
}

export interface DataTableColumn<T> {
    id: keyof T | "actions"; 
    label: string;
    align?: "left" | "center" | "right";
    minWidth?: number;
    render: (row: T) => React.ReactNode;
}

export interface Transfer {
    id: string;
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    status: "Pending" | "Complete" | "Cancelled";
    timestamp: string; 
    reason?: string;
}

export interface Alert {
    id: string;
    productId: string;
    warehouseId?: string;
    status: "Critical" | "Low" | "Overstocked";
    currentStock: number;
    reorderPoint: number;
    acknowledged: boolean;
    timestamp: string;
    resolutionNotes?: string;
}
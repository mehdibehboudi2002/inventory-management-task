// Interface for the core Product data structure.
export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    unitCost: number; // Stored as a number
    reorderPoint: number;
}

// Interface for the core Warehouse data structure.
export interface Warehouse {
    id: string;
    code: string;
    name: string;
    location: string;
}


 // Interface for the Stock level data structure (Product in Warehouse).

export interface StockItem {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
}


 // Interface for a generic column definition used by MuiDataTable.
export interface DataTableColumn<T> {
    id: keyof T | 'actions'; // Column key, or 'actions' for the action column
    label: string;
    align?: 'left' | 'center' | 'right';
    minWidth?: number;
    // Function to render the cell content, allowing custom JSX/logic (like currency formatting or Chips)
    render: (row: T) => React.ReactNode;
}


 // Interface for a Stock Transfer record.
export interface Transfer {
    id: string;
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    quantity: number;
    status: 'Pending' | 'Complete' | 'Cancelled';
    timestamp: string; // ISO 8601 date string
    reason?: string;
}


 // Interface for a Low Stock Alert record.

export interface Alert {
    id: string;
    productId: string;
    warehouseId?: string; 
    status: 'Critical' | 'Low' | 'Overstocked';
    currentStock: number;
    reorderPoint: number;
    acknowledged: boolean;
    timestamp: string;
    resolutionNotes?: string;
}

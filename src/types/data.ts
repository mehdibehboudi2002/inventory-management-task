export interface Product {
  id: number; // CORRECTED: Changed from string to number to match original API logic (parseInt)
  name: string; 
  sku: string; 
  description: string;
  unitPrice: number; 
  reorderPoint: number;
}

export interface Warehouse {
  id: number; // CORRECTED: Changed from string to number
  name: string;
  location: string;
  manager: string;
}

// Represents the stock of a specific product in a specific warehouse
export interface Stock {
  productId: number; // CORRECTED: Changed from string to number
  warehouseId: number; // CORRECTED: Changed from string to number
  quantity: number;
  lastUpdated: string; // ISO date string of last update
}

// Data structure for the low stock alert system (Task 3)
export interface Alert {
    id: number; // Assuming numeric ID
    productId: number; // CORRECTED: Changed from string to number
    warehouseId: number; // CORRECTED: Changed from string to number
    level: 'CRITICAL' | 'LOW' | 'ADEQUATE' | 'OVERSTOCKED';
    status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
    createdAt: string;
}

// Data structure for the stock transfer system (Task 2)
export interface Transfer {
    id: number; // Assuming numeric ID
    productId: number; // CORRECTED: Changed from string to number
    fromWarehouseId: number; // CORRECTED: Changed from string to number
    toWarehouseId: number; // CORRECTED: Changed from string to number
    quantity: number;
    status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELED';
    initiatedAt: string; // ISO date string
    completedAt?: string; // Optional ISO date string
}
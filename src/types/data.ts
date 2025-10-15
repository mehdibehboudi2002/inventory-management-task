export interface Product {
  id: number; 
  name: string; 
  sku: string; 
  description: string;
  unitPrice: number; 
  reorderPoint: number;
}

export interface Warehouse {
  id: number; 
  name: string;
  location: string;
  manager: string;
}

export interface Stock {
  productId: number; 
  warehouseId: number; 
  quantity: number;
  lastUpdated: string; 
}

export interface Alert {
    id: number; 
    productId: number; 
    warehouseId: number; 
    level: 'CRITICAL' | 'LOW' | 'ADEQUATE' | 'OVERSTOCKED';
    status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
    createdAt: string;
}

export interface Transfer {
    id: number; 
    productId: number; 
    fromWarehouseId: number; 
    toWarehouseId: number; 
    quantity: number;
    status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELED';
    initiatedAt: string; 
    completedAt?: string; 
}
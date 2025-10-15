import { Product, Warehouse, StockItem, Transfer } from "../types/inventory";

// Defines the structure for the data required by the dashboard hook.
interface DashboardInventoryData {
  products: Product[];
  warehouses: Warehouse[];
  stock: StockItem[];
}

// Defines the structure for the transfer creation payload.
interface TransferPayload {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason: string;
}

// Defines the structure for the stock item creation payload.
interface StockPayload {
  productId: string | number;
  warehouseId: string | number;
  quantity: number;
}

// Fetches all core inventory data for the dashboard (Products, Warehouses, Transfers, Stock).
export async function fetchInventoryData(): Promise<
  DashboardInventoryData & { transfers: Transfer[] }
> {
  const [productsRes, warehousesRes, transfersRes, stockRes] =
    await Promise.all([
      fetch("/api/products"),
      fetch("/api/warehouses"),
      fetch("/api/transfers"),
      fetch("/api/stock"),
    ]);

  // Check all responses for success
  if (
    !productsRes.ok ||
    !warehousesRes.ok ||
    !transfersRes.ok ||
    !stockRes.ok
  ) {
    throw new Error(
      "Failed to fetch one or more required inventory data streams."
    );
  }

  const [productsData, warehousesData, transfersData, stockData] =
    await Promise.all([
      productsRes.json(),
      warehousesRes.json(),
      transfersRes.json(),
      stockRes.json(),
    ]);

  return {
    products: productsData,
    warehouses: warehousesData,
    transfers: transfersData,
    stock: stockData,
  };
}

// Fetches a list of all products.
export async function fetchProductsList(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products list.");
  }

  return response.json();
}

// Fetches a list of all warehouses.
export async function fetchWarehousesList(): Promise<Warehouse[]> {
  const response = await fetch("/api/warehouses");

  if (!response.ok) {
    throw new Error("Failed to fetch warehouses list.");
  }

  return response.json();
}

// Fetches a list of all stock items.
export async function fetchStockList(): Promise<StockItem[]> {
  const response = await fetch("/api/stock");

  if (!response.ok) {
    throw new Error("Failed to fetch stock list.");
  }

  return response.json();
}

// Deletes a product record by ID.
export async function deleteProduct(id: string | number): Promise<void> {
  const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete product record.");
  }
}

// Deletes a warehouse record by ID.
export async function deleteWarehouse(id: string | number): Promise<void> {
  const response = await fetch(`/api/warehouses/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete warehouse record.");
  }
}

// Creates a new stock record.
export async function createStockItem(payload: StockPayload): Promise<void> {
  const response = await fetch("/api/stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Stock creation failed.");
  }
}

// Deletes a stock record by ID.
export async function deleteStockItem(id: string | number): Promise<void> {
  const response = await fetch(`/api/stock/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete stock record.");
  }
}

// Define interfaces for creation/update payloads (if not already in inventory.ts)
interface ProductPayload {
  sku: string;
  name: string;
  category: string;
  unitCost: number;
  reorderPoint: number;
}
interface WarehousePayload {
  name: string;
  location: string;
  code: string;
}

// Creates a new product record.
export async function createProduct(payload: ProductPayload): Promise<void> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Product creation failed.");
  }
}

// Updates an existing product record.
export async function updateProduct(
  id: string | number,
  payload: ProductPayload
): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Product update failed.");
  }
}

// Creates a new warehouse record.
export async function createWarehouse(
  payload: WarehousePayload
): Promise<void> {
  const response = await fetch("/api/warehouses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Warehouse creation failed.");
  }
}

// Updates an existing warehouse record.
export async function updateWarehouse(
  id: string | number,
  payload: WarehousePayload
): Promise<void> {
  const response = await fetch(`/api/warehouses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Warehouse update failed.");
  }
}

// Fetches a single product item.
export async function fetchProductItem(id: string | number): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  if (!response.ok) throw new Error("Failed to fetch product item.");
  return response.json();
}

// Fetches a single warehouse item.
export async function fetchWarehouseItem(
  id: string | number
): Promise<Warehouse> {
  const response = await fetch(`/api/warehouses/${id}`);
  if (!response.ok) throw new Error("Failed to fetch warehouse item.");
  return response.json();
}

// Fetches a single stock item.
export async function fetchStockItem(id: string | number) {
  const response = await fetch(`/api/stock/${id}`);
  if (!response.ok) throw new Error("Failed to fetch stock item.");
  return response.json();
}

// Updates an existing stock record.
export async function updateStockItem(
  id: string | number,
  payload: StockPayload
): Promise<void> {
  const response = await fetch(`/api/stock/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Stock update failed.");
  }
}

// Creates a new transfer record.
export async function createTransfer(payload: TransferPayload): Promise<void> {
  const response = await fetch("/api/transfers/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Attempt to parse a meaningful error message from the response body
    const error = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Transfer creation failed.");
  }
}

// Deletes a transfer record by ID.
export async function deleteTransfer(id: string): Promise<void> {
  const response = await fetch(`/api/transfers/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete transfer record.");
  }
}

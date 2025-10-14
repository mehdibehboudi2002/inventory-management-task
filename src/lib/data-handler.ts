import * as fs from "fs";
import * as path from "path";

// Define the root directory for data files
const dataDir = path.join(process.cwd(), "src", "data");

export const PRODUCTS_FILE = "products.json";
export const WAREHOUSES_FILE = "warehouses.json";
export const STOCK_FILE = "stock.json";
export const TRANSFERS_FILE = "transfers.json";

// Utility function to read data from a JSON file.
function readFileData(fileName: string): any[] {
  const filePath = path.join(dataDir, fileName);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // If file doesn't exist, return empty array
      console.warn(`File not found: ${fileName}. Returning empty array.`);
      return [];
    }
    console.error(`Error reading ${fileName}:`, error);
    throw new Error(`Failed to read data from ${fileName}`);
  }
}

// Utility function to write data to a JSON file.
export function writeData(fileName: string, data: any[]): void {
  const filePath = path.join(dataDir, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw new Error(`Failed to write data to ${fileName}`);
  }
}

// Helper to generate a new unique ID.
export function getNewId(data: { id: string | number }[]): string {
  if (data.length === 0) return "1";

  // Find the highest existing ID by parsing to number
  const maxId = data.reduce((max, item) => {
    const currentId = parseInt(String(item.id), 10);
    return currentId > max ? currentId : max;
  }, 0);

  return String(maxId + 1);
}

export const loadData = (file: string) => {
  const data = readFileData(file);

  // Standardize IDs to strings for consistency
  return data.map((item: any) => ({
    ...item,
    id: String(item.id),
    // Standardize common foreign key IDs, if they exist
    ...(item.productId !== undefined && { productId: String(item.productId) }),
    ...(item.warehouseId !== undefined && {
      warehouseId: String(item.warehouseId),
    }),
    ...(item.fromWarehouseId !== undefined && {
      fromWarehouseId: String(item.fromWarehouseId),
    }),
    ...(item.toWarehouseId !== undefined && {
      toWarehouseId: String(item.toWarehouseId),
    }),
  }));
};

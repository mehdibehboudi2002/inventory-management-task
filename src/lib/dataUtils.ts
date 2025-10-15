import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
export const WAREHOUSES_FILE = path.join(DATA_DIR, 'warehouses.json');
export const STOCK_FILE = path.join(DATA_DIR, 'stock.json');
export const TRANSFERS_FILE = path.join(DATA_DIR, 'transfers.json'); 

export function loadData(filePath: string): any[] {
    try {
        // Read the file synchronously
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        
        // Return the parsed JSON content
        return JSON.parse(jsonString);
    } catch (error) {
        throw new Error(`Failed to load dashboard data required for SSR from ${path.basename(filePath)}.`);
    }
}
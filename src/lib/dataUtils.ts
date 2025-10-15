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

export function saveData(filePath: string, data: any): void {
    try {
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write data to file with proper formatting
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        throw new Error(`Failed to save data to ${path.basename(filePath)}: ${error}`);
    }
}
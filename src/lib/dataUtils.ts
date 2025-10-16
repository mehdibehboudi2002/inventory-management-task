import fs from 'fs';
import path from 'path';

// CRITICAL: Match your actual folder structure
// Development: src/data/
// Production: /tmp/data/
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DATA_DIR = IS_PRODUCTION 
  ? '/tmp/data' 
  : path.join(process.cwd(), 'src', 'data');

export const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
export const WAREHOUSES_FILE = path.join(DATA_DIR, 'warehouses.json');
export const STOCK_FILE = path.join(DATA_DIR, 'stock.json');
export const TRANSFERS_FILE = path.join(DATA_DIR, 'src/data');

// Helper to initialize data in /tmp on first request (production only)
function initializeProductionData() {
  if (!IS_PRODUCTION) return;

  try {
    // Ensure /tmp/data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('Created /tmp/data directory');
    }

    // Copy initial data from build-time src/data folder to /tmp/data
    const sourceDir = path.join(process.cwd(), 'src', 'data');
    const files = ['products.json', 'warehouses.json', 'stock.json', 'transfers.json', 'alerts.json'];

    files.forEach(file => {
      const destPath = path.join(DATA_DIR, file);
      
      // Only initialize if file doesn't exist in /tmp yet
      if (!fs.existsSync(destPath)) {
        const sourcePath = path.join(sourceDir, file);
        
        if (fs.existsSync(sourcePath)) {
          // Copy from source
          const data = fs.readFileSync(sourcePath, 'utf-8');
          fs.writeFileSync(destPath, data, 'utf-8');
          console.log(`✅ Copied ${file} to /tmp/data`);
        } else {
          // Create empty array if source doesn't exist
          fs.writeFileSync(destPath, JSON.stringify([], null, 2), 'utf-8');
          console.log(`⚠️ Created empty ${file} in /tmp/data`);
        }
      }
    });
  } catch (error) {
    console.error('❌ Error initializing production data:', error);
  }
}

export function loadData(filePath: string): any[] {
    try {
        // Initialize production data if needed
        initializeProductionData();
        
        // Check if file exists, if not create with empty array
        if (!fs.existsSync(filePath)) {
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
          console.log(`Created missing file: ${path.basename(filePath)}`);
        }
        
        // Read the file synchronously
        const jsonString = fs.readFileSync(filePath, 'utf-8');
        
        // Return the parsed JSON content
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`❌ Failed to load data from ${path.basename(filePath)}:`, error);
        throw new Error(`Failed to load dashboard data required for SSR from ${path.basename(filePath)}.`);
    }
}

export function saveData(filePath: string, data: any): void {
    try {
        // Initialize production data if needed (ensures /tmp/data exists)
        initializeProductionData();
        
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
        
        // Write data to file with proper formatting
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Saved data to ${path.basename(filePath)} in ${IS_PRODUCTION ? '/tmp/data' : 'src/data'}`);
    } catch (error) {
        console.error(`❌ Failed to save data to ${path.basename(filePath)}:`, error);
        throw new Error(`Failed to save data to ${path.basename(filePath)}: ${error}`);
    }
}
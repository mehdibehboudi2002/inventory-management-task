import { NextApiRequest, NextApiResponse } from "next";
import { loadData, saveData, PRODUCTS_FILE, STOCK_FILE } from "@/lib/dataUtils";
import { Product, StockItem, Alert } from "@/types/inventory";
import path from "path";

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DATA_DIR = IS_PRODUCTION ? '/tmp/data' : path.join(process.cwd(), 'src', 'data');
const ALERTS_FILE = path.join(DATA_DIR, "alerts.json");

function calculateAlerts(products: Product[], stock: StockItem[]): Alert[] {
  const alerts: Alert[] = [];

  products.forEach((product) => {
    const productStock = stock.filter((s) => s.productId === String(product.id));
    const totalStock = productStock.reduce((sum, s) => sum + s.quantity, 0);
    const percentOfReorder = (totalStock / product.reorderPoint) * 100;

    let level: "Critical" | "Low" | "Adequate" | "Overstocked";
    
    if (percentOfReorder < 50) {
      level = "Critical";
    } else if (percentOfReorder < 100) {
      level = "Low";
    } else if (percentOfReorder <= 150) {
      level = "Adequate";
    } else {
      level = "Overstocked";
    }

    if (level !== "Adequate") {
      const recommendedOrderQuantity =
        level === "Overstocked"
          ? 0
          : Math.max(0, Math.ceil(product.reorderPoint * 1.5 - totalStock));

      const warehouseDetails = productStock.map((s) => ({
        id: s.warehouseId,
        name: `Warehouse ${s.warehouseId}`,
        stock: s.quantity,
      }));

      alerts.push({
        id: `alert-${product.id}-${Date.now()}`,
        productId: String(product.id),
        productName: product.name,
        productSku: product.sku,
        totalStock,
        reorderPoint: product.reorderPoint,
        level,
        status: "Open",
        percentOfReorder: Math.round(percentOfReorder),
        recommendedOrderQuantity,
        warehouses: warehouseDetails,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return alerts;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const products: Product[] = loadData(PRODUCTS_FILE);
      const stock: StockItem[] = loadData(STOCK_FILE);

      const alerts = calculateAlerts(products, stock);
      saveData(ALERTS_FILE, alerts);

      res.status(200).json({ 
        message: "Alerts recalculated successfully", 
        count: alerts.length,
        alerts 
      });
    } catch (error) {
      console.error("Error calculating alerts:", error);
      res.status(500).json({ error: "Failed to calculate alerts" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
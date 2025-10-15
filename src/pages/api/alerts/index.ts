import { NextApiRequest, NextApiResponse } from "next";
import { loadData, saveData, PRODUCTS_FILE, STOCK_FILE } from "@/lib/dataUtils";
import { Product, StockItem, Alert } from "@/types/inventory";
import path from "path";
import fs from "fs";

const ALERTS_FILE = path.join(process.cwd(), "data", "alerts.json");

// Ensure alerts file exists
if (!fs.existsSync(ALERTS_FILE)) {
  fs.writeFileSync(ALERTS_FILE, JSON.stringify([], null, 2));
}

function calculateAlerts(products: Product[], stock: StockItem[]): Alert[] {
  const alerts: Alert[] = [];

  products.forEach((product) => {
    // Calculate total stock across all warehouses
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

    // Only create alerts for Critical, Low, or Overstocked
    if (level !== "Adequate") {
      const recommendedOrderQuantity =
        level === "Overstocked"
          ? 0
          : Math.max(0, Math.ceil(product.reorderPoint * 1.5 - totalStock));

      const warehouseDetails = productStock.map((s) => ({
        id: s.warehouseId,
        name: `Warehouse ${s.warehouseId}`, // You can enhance this with actual warehouse names
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
  if (req.method === "GET") {
    try {
      const products: Product[] = loadData(PRODUCTS_FILE);
      const stock: StockItem[] = loadData(STOCK_FILE);
      let alerts: Alert[] = loadData(ALERTS_FILE);

      // Calculate fresh alerts
      const calculatedAlerts = calculateAlerts(products, stock);

      // Merge with existing alerts to preserve status changes
      const existingAlertMap = new Map(
        alerts.map((a) => [a.productId, a])
      );

      const mergedAlerts = calculatedAlerts.map((newAlert) => {
        const existing = existingAlertMap.get(newAlert.productId);
        if (existing && existing.status !== "Resolved") {
          // Keep the existing alert but update stock numbers
          return {
            ...existing,
            totalStock: newAlert.totalStock,
            percentOfReorder: newAlert.percentOfReorder,
            recommendedOrderQuantity: newAlert.recommendedOrderQuantity,
            level: newAlert.level,
            warehouses: newAlert.warehouses,
          };
        }
        return newAlert;
      });

      // Save merged alerts
      saveData(ALERTS_FILE, mergedAlerts);

      // Apply filters from query
      const { status, level } = req.query;
      let filtered = mergedAlerts;

      if (status && status !== "All") {
        filtered = filtered.filter((a) => a.status === status);
      }

      if (level && level !== "All") {
        filtered = filtered.filter((a) => a.level === level);
      }

      res.status(200).json(filtered);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
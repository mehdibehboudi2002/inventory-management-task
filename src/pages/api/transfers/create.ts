import type { NextApiRequest, NextApiResponse } from "next";
import {
  loadData,
  writeData,
  getNewId,
  STOCK_FILE,
  TRANSFERS_FILE,
} from "@/lib/dataHandler";
import { StockItem, Transfer } from "@/types/inventory";

// Define the expected request body type
interface NewTransferPayload {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Transfer | { message: string }>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { productId, fromWarehouseId, toWarehouseId, quantity, reason } =
    req.body as NewTransferPayload;

  // Comprehensive Input Validation
  if (!productId || !fromWarehouseId || !toWarehouseId || !reason) {
    return res
      .status(400)
      .json({
        message: "Product, warehouse IDs, and transfer reason are required.",
      });
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive number." });
  }
  if (fromWarehouseId === toWarehouseId) {
    return res
      .status(400)
      .json({
        message:
          "Source and destination warehouses must be different for a transfer.",
      });
  }

  try {
    // Read current state of both files
    const allStock = loadData(STOCK_FILE) as StockItem[];
    const allTransfers = loadData(TRANSFERS_FILE) as Transfer[];

    const sourceStockIndex = allStock.findIndex(
      (s) => s.productId === productId && s.warehouseId === fromWarehouseId
    );
    const sourceStock =
      sourceStockIndex !== -1 ? allStock[sourceStockIndex] : null;

    const currentStock = sourceStock?.quantity ?? 0;
    if (currentStock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${currentStock} units are currently available at the source warehouse.`,
      });
    }

    // Update Stock Levels

    // Subtract from source (guaranteed to exist based on validation above)
    if (sourceStock) {
      const remaining = currentStock - quantity;

      if (remaining > 0) {
        // Update the quantity at the existing index
        allStock[sourceStockIndex].quantity = remaining;
      } else {
        // Remove the stock item entirely if the quantity drops to zero
        allStock.splice(sourceStockIndex, 1);
      }
    }

    // Add to destination (Check if product exists at destination first)
    const destinationStockIndex = allStock.findIndex(
      (s) => s.productId === productId && s.warehouseId === toWarehouseId
    );

    if (destinationStockIndex !== -1) {
      // Product already exists in destination: update quantity
      allStock[destinationStockIndex].quantity += quantity;
    } else {
      // Product doesn't exist in destination: create a new stock entry
      const newStock: StockItem = {
        id: getNewId(allStock),
        productId,
        warehouseId: toWarehouseId,
        quantity,
      };
      allStock.push(newStock);
    }

    // Create New Transfer Record
    const newTransfer: Transfer = {
      id: getNewId(allTransfers),
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      status: "Complete",
      timestamp: new Date().toISOString(),
      reason,
    };
    allTransfers.push(newTransfer);

    // Write to both files
    writeData(STOCK_FILE, allStock);
    writeData(TRANSFERS_FILE, allTransfers);
    res.status(201).json(newTransfer);
  } catch (error) {
    console.error("Stock transfer failed unexpectedly:", error);
    res
      .status(500)
      .json({
        message:
          "Internal Server Error: Failed to process transfer or update data files.",
      });
  }
}

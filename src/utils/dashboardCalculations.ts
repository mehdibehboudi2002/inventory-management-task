import { 
    Product, 
    Warehouse, 
    StockItem,
    InventoryOverviewItem,
    ChartDataItem,
    DashboardMetrics
} from "../types/inventory";


 // Calculates the inventory status for each product based on its total stock quantity 
export const calculateInventoryOverview = (
  products: Product[],
  stock: StockItem[]
): InventoryOverviewItem[] => {
  return products.map((product) => {
    // String conversion ensures robust comparison regardless of whether IDs are number or string in the data source.
    const productStock = stock.filter(
      (s) => String(s.productId) === String(product.id)
    );
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    // Note: If reorderPoint is 0, this will result in NaN, which is handled implicitly below.
    const percentOfReorder = (totalQuantity / product.reorderPoint) * 100;

    let status = "Adequate";
    let statusColor: "error" | "warning" | "success" | "info" = "success";

    if (percentOfReorder < 20) {
      status = "Critical";
      statusColor = "error";
    } else if (percentOfReorder < 100) {
      status = "Low Stock";
      statusColor = "warning";
    } else if (percentOfReorder > 200) {
      status = "Overstocked";
      statusColor = "info";
    }

    return {
      ...product,
      totalQuantity,
      status,
      statusColor,
      percentOfReorder,
    };
  });
};

 // Calculates key inventory metrics and data structures required for dashboard charts.
export const calculateMetrics = (
  products: Product[],
  warehouses: Warehouse[],
  stock: StockItem[],
  inventoryOverview: InventoryOverviewItem[]
): DashboardMetrics => {
  // Total Value
  const totalValue = stock.reduce((sum, item) => {
    const product = products.find(
      (p) => String(p.id) === String(item.productId)
    );
    return sum + (product ? product.unitCost * item.quantity : 0);
  }, 0);

  // Low Stock Count
  const lowStockCount = inventoryOverview.filter(
    (item) => item.statusColor === "error" || item.statusColor === "warning"
  ).length;

  // Warehouse Data (for Bar Chart)
  const warehouseData: ChartDataItem[] = warehouses.map((warehouse) => {
    const warehouseStock = stock.filter(
      (s) => String(s.warehouseId) === String(warehouse.id)
    );
    const value = warehouseStock.reduce((sum, item) => {
      const product = products.find(
        (p) => String(p.id) === String(item.productId)
      );
      return sum + (product ? product.unitCost * item.quantity : 0);
    }, 0);
    return { name: warehouse.code, value: value, fullName: warehouse.name };
  });

  // Category Data (for Pie Chart)
  const categoryData: ChartDataItem[] = products
    .reduce((acc: ChartDataItem[], product) => {
      const existing = acc.find((item) => item.name === product.category);
      const productStock = stock.filter(
        (s) => String(s.productId) === String(product.id)
      );
      const totalQty = productStock.reduce((sum, s) => sum + s.quantity, 0);

      if (existing) {
        existing.value += totalQty;
      } else {
        acc.push({ name: product.category, value: totalQty });
      }
      return acc;
    }, [])
    .filter((item) => item.value > 0);

  // Stock Status Data (for Horizontal Bar Chart)
  const stockStatusData: ChartDataItem[] = [
    {
      name: "Critical",
      value: inventoryOverview.filter((i) => i.statusColor === "error").length,
      color: "#d32f2f",
    },
    {
      name: "Low Stock",
      value: inventoryOverview.filter((i) => i.statusColor === "warning")
        .length,
      color: "#ff9800",
    },
    {
      name: "Adequate",
      value: inventoryOverview.filter((i) => i.statusColor === "success")
        .length,
      color: "#4caf50",
    },
    {
      name: "Overstocked",
      value: inventoryOverview.filter((i) => i.statusColor === "info").length,
      color: "#0288d1",
    },
  ].filter((item) => item.value > 0);

  return {
    totalValue,
    lowStockCount,
    warehouseData,
    categoryData,
    stockStatusData,
  };
};

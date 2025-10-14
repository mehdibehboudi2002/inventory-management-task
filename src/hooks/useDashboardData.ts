import { useState, useEffect } from "react";

const calculateInventoryOverview = (products, stock) => {
  return products.map((product) => {
    const productStock = stock.filter((s) => s.productId === product.id);
    const totalQuantity = productStock.reduce((sum, s) => sum + s.quantity, 0);
    const percentOfReorder = (totalQuantity / product.reorderPoint) * 100;

    let status = "Adequate";
    let statusColor = "success"; // Green
    if (percentOfReorder < 20) {
      status = "Critical";
      statusColor = "error"; // Red
    } else if (percentOfReorder < 100) {
      status = "Low Stock";
      statusColor = "warning"; // Orange
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

const calculateMetrics = (products, warehouses, stock, inventoryOverview) => {
  // 1. Total Value
  const totalValue = stock.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.unitCost * item.quantity : 0);
  }, 0);

  // 2. Low Stock Count
  const lowStockCount = inventoryOverview.filter(
    (item) => item.statusColor === "error" || item.statusColor === "warning"
  ).length;

  // 3. Warehouse Data (for Bar Chart)
  const warehouseData = warehouses.map((warehouse) => {
    const warehouseStock = stock.filter((s) => s.warehouseId === warehouse.id);
    const value = warehouseStock.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.unitCost * item.quantity : 0);
    }, 0);
    return { name: warehouse.code, value: value, fullName: warehouse.name };
  });

  // 4. Category Data (for Pie Chart)
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    const productStock = stock.filter((s) => s.productId === product.id);
    const totalQty = productStock.reduce((sum, s) => sum + s.quantity, 0);
    if (existing) {
      existing.value += totalQty;
    } else {
      acc.push({ name: product.category, value: totalQty });
    }
    return acc;
  }, []);

  // 5. Stock Status Data (for Vertical Bar Chart)
  const stockStatusData = [
    { name: "Critical", value: inventoryOverview.filter((i) => i.statusColor === "error").length, color: "#d32f2f" },
    { name: "Low Stock", value: inventoryOverview.filter((i) => i.statusColor === "warning").length, color: "#ff9800" },
    { name: "Adequate", value: inventoryOverview.filter((i) => i.statusColor === "success").length, color: "#4caf50" },
    { name: "Overstocked", value: inventoryOverview.filter((i) => i.statusColor === "info").length, color: "#0288d1" },
  ].filter((item) => item.value > 0);


  return {
    totalValue,
    lowStockCount,
    warehouseData,
    categoryData,
    stockStatusData,
  };
};

export function useDashboardData() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/warehouses").then((res) => res.json()),
      fetch("/api/stock").then((res) => res.json()),
    ])
      .then(([productsData, warehousesData, stockData]) => {
        setProducts(productsData);
        setWarehouses(warehousesData);
        setStock(stockData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError("Failed to load inventory data. Please check the server status.");
        setLoading(false);
      });
  }, []);

  // Recalculate derived data whenever products, stock, or warehouses change
  const inventoryOverview = calculateInventoryOverview(products, stock);
  const metrics = calculateMetrics(products, warehouses, stock, inventoryOverview);

  return {
    ...metrics,
    products,
    warehouses,
    inventoryOverview,
    loading,
    error,
  };
}
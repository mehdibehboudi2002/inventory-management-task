import { useState, useEffect } from "react";
import {
  Product,
  Warehouse,
  StockItem,
  InventoryOverviewItem,
  DashboardMetrics,
} from "../types/inventory";
import { fetchInventoryData } from "@/api/dataService";
import {
  calculateInventoryOverview,
  calculateMetrics,
} from "@/utils/dashboardCalculations";

// Define the shape of the final hook return value
interface UseDashboardDataResult extends DashboardMetrics {
  products: Product[];
  warehouses: Warehouse[];
  inventoryOverview: InventoryOverviewItem[];
  loading: boolean;
  error: string | null;
}

// Custom hook to fetch, process, and manage all inventory data required for the dashboard.
export function useDashboardData(): UseDashboardDataResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchInventoryData();

        setProducts(data.products);
        setWarehouses(data.warehouses);
        setStock(data.stock);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
        setError(
          err.message ||
            "Failed to load inventory data. Please check the server status."
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const inventoryOverview = calculateInventoryOverview(products, stock);
  const metrics = calculateMetrics(
    products,
    warehouses,
    stock,
    inventoryOverview
  );

  return {
    ...metrics,
    products,
    warehouses,
    inventoryOverview,
    loading,
    error,
  };
}

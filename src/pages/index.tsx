import {
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Alert,
  Box,
  Button,
} from "@mui/material";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import ListTable from "@/components/ui/ListTable";
import { DataTableColumn, Product, Warehouse, StockItem, Alert as AlertType } from "@/types/inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardChartPanel from "@/components/dashboard/DashboardChartPanel";
import { calculateInventoryOverview, calculateMetrics } from "@/utils/dashboardCalculations";

// Define the Inventory Item type based on the data displayed in the dashboard table
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  totalQuantity: number;
  reorderPoint: number;
  status: string;
  statusColor: "error" | "warning" | "success" | "primary" | "secondary" | "info" | undefined;
}

const GREEN_MAIN = "#2e7d32";
const EARTH_BROWN = "#795548";
const BLUE_ACCENT = "#0288d1";
const CHART_COLORS = [GREEN_MAIN, "#66bb6a", EARTH_BROWN, BLUE_ACCENT];

interface HomeProps {
  products: Product[];
  warehouses: Warehouse[];
  stock: StockItem[];
  alerts: AlertType[];
  error?: string;
}

export default function Home({ products, warehouses, stock, alerts, error }: HomeProps) {
  // Calculate all dashboard data from the server-provided props
  const inventoryOverview = calculateInventoryOverview(products, stock);
  const metrics = calculateMetrics(products, warehouses, stock, inventoryOverview);

  const {
    totalValue,
    lowStockCount,
    warehouseData,
    categoryData,
    stockStatusData,
  } = metrics;

  // Count open alerts by level
  const criticalAlerts = alerts.filter(a => a.level === "Critical" && a.status === "Open").length;
  const lowAlerts = alerts.filter(a => a.level === "Low" && a.status === "Open").length;

  // Define columns for the Inventory Overview ListTable
  const inventoryColumns: DataTableColumn<InventoryItem>[] = [
    {
      id: "sku",
      label: "SKU",
      minWidth: 80,
      render: (row) => row.sku,
    },
    {
      id: "name",
      label: "Product Name",
      minWidth: 200,
      render: (row) => row.name,
    },
    {
      id: "category",
      label: "Category",
      minWidth: 120,
      render: (row) => row.category,
    },
    {
      id: "totalQuantity",
      label: "Total Stock",
      minWidth: 100,
      align: "right",
      render: (row) => row.totalQuantity.toLocaleString(),
    },
    {
      id: "reorderPoint",
      label: "Reorder Point",
      minWidth: 100,
      align: "right",
      render: (row) => row.reorderPoint.toLocaleString(),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      align: "center",
      render: (row) => (
        <Chip
          label={row.status}
          color={row.statusColor as "error" | "warning" | "success"}
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        />
      ),
    },
  ];

  if (error) {
    // Error display
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Typography variant="h5" color="textSecondary">
            Please refresh the page or check the server connection.
          </Typography>
        </Container>
      </Layout>
    );
  }

  // Conditional styles for Low Stock Alert Card
  const alertsCount = alerts.filter(a => a.status === "Open").length;
  const lowStockGradient = alertsCount > 0
    ? "linear-gradient(135deg, #f57c00 0%, #ffab2cff 100%)"
    : "linear-gradient(135deg, #14A44D 0%, #5ad78cff 100%)";

  const iconSx = { fontSize: { xs: 30, sm: 40 }, opacity: 0.9 };

  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, sm: 3 }, mb: 2, px: { xs: 2, sm: 3 } }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 2,
            color: GREEN_MAIN,
            fontWeight: 600,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Dashboard Overview
        </Typography>

        {/* Statistics Cards */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Total Products"
              value={products.length}
              icon={<CategoryIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #805b50ff 0%, #a3887dff 100%)"
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Active Warehouses"
              value={warehouses.length}
              icon={<WarehouseIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #2e7d32 0%, #5bb25eff 100%)"
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Inventory Value"
              value={`$${totalValue.toFixed(0)}`}
              icon={<AttachMoneyIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #855a4dff 0%, #a48578ff 100%)"
            />
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Box
              component="a"
              href="/alerts"
              sx={{
                textDecoration: "none",
                display: "block",
                cursor: "pointer",
              }}
            >
              <DashboardStatCard
                title="Active Alerts"
                value={alertsCount}
                icon={<WarningAmberIcon sx={iconSx} />}
                backgroundGradient={lowStockGradient}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Quick Alerts Widget */}
        {alertsCount > 0 && (
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: "20px",
              mb: { xs: 3, md: 4 },
              border: "2px solid #f57c00",
              boxShadow: '0 4px 12px rgba(245, 124, 0, 0.15)',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <NotificationsActiveIcon sx={{ color: "#f57c00", fontSize: 28 }} />
                <Typography variant="h6" sx={{ color: "#f57c00", fontWeight: 600 }}>
                  Active Alerts ({alertsCount})
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                href="/alerts"
                sx={{
                  borderRadius: "10px",
                  borderColor: "#f57c00",
                  color: "#f57c00",
                  "&:hover": {
                    borderColor: "#e65100",
                    bgcolor: "rgba(245, 124, 0, 0.04)"
                  }
                }}
              >
                View All Alerts
              </Button>
            </Box>

            <Grid container spacing={2}>
              {alerts.slice(0, 3).map((alert) => (
                <Grid item xs={12} sm={6} md={4} key={alert.id}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: alert.level === "Critical"
                        ? "rgba(211, 47, 47, 0.08)"
                        : alert.level === "Low"
                          ? "rgba(245, 124, 0, 0.08)"
                          : "rgba(2, 136, 209, 0.08)",
                      border: `1px solid ${alert.level === "Critical"
                          ? "#d32f2f"
                          : alert.level === "Low"
                            ? "#f57c00"
                            : "#0288d1"
                        }`,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                      {alert.level === "Critical" ? (
                        <ErrorIcon sx={{ color: "#d32f2f", fontSize: 20 }} />
                      ) : alert.level === "Low" ? (
                        <WarningIcon sx={{ color: "#f57c00", fontSize: 20 }} />
                      ) : (
                        <TrendingUpIcon sx={{ color: "#0288d1", fontSize: 20 }} />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                          {alert.productName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {alert.productSku}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">
                          Stock Level
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {alert.totalStock} / {alert.reorderPoint}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${alert.percentOfReorder}%`}
                        size="small"
                        sx={{
                          bgcolor: alert.level === "Critical" ? "#d32f2f" : alert.level === "Low" ? "#f57c00" : "#0288d1",
                          color: "white",
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    {alert.level !== "Overstocked" && (
                      <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                        <Typography variant="caption" color="textSecondary">
                          Recommended Order: <strong>{alert.recommendedOrderQuantity} units</strong>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Charts Section */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          {/* Inventory by Warehouse (Bar Chart) */}
          <Grid item xs={12} md={6}>
            <DashboardChartPanel title="Inventory Value by Warehouse">
              {warehouseData.length > 0 && warehouseData.some(w => w.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={warehouseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => `$${typeof value === 'number' ? value.toFixed(2) : value}`}
                      labelFormatter={(label) => {
                        const item = warehouseData.find((d) => d.name === label);
                        return item ? item.fullName : label;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="value" fill={GREEN_MAIN} name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No inventory data available
                  </Typography>
                </Box>
              )}
            </DashboardChartPanel>
          </Grid>

          {/* Products by Category (Pie Chart) */}
          <Grid item xs={12} md={6}>
            <DashboardChartPanel title="Inventory by Category">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(typeof percent === 'number' ? percent * 100 : 0).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      style={{ fontSize: "11px" }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No category data available
                  </Typography>
                </Box>
              )}
            </DashboardChartPanel>
          </Grid>

          {/* Stock Status Distribution (Horizontal Bar Chart) */}
          <Grid item xs={12}>
            <DashboardChartPanel title="Stock Status Distribution" isFullWidth={true}>
              {stockStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockStatusData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                    <Bar dataKey="value" name="Products" fill={GREEN_MAIN}>
                      {stockStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No stock status data available
                  </Typography>
                </Box>
              )}
            </DashboardChartPanel>
          </Grid>
        </Grid>

        {/* Inventory Overview Table */}
        <Paper sx={{ p: { xs: 1, sm: 3 }, borderRadius: "20px" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: GREEN_MAIN, fontWeight: 600 }}
          >
            Inventory Overview
          </Typography>
          <ListTable<InventoryItem>
            data={inventoryOverview as InventoryItem[]}
            columns={inventoryColumns}
            loading={false}
            emptyMessage="No inventory items found."
          />
        </Paper>
      </Container>
    </Layout>
  );
}

// SERVER-SIDE DATA FETCHING
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const { loadData, PRODUCTS_FILE, WAREHOUSES_FILE, STOCK_FILE } = await import('@/lib/dataUtils');
    const path = await import('path');

    const ALERTS_FILE = path.default.join(process.cwd(), "data", "alerts.json");

    // Load data from the server
    const products = loadData(PRODUCTS_FILE);
    const warehouses = loadData(WAREHOUSES_FILE);
    const stock = loadData(STOCK_FILE);

    // Load alerts and filter for open ones only
    let alerts = [];
    try {
      alerts = loadData(ALERTS_FILE).filter((a: AlertType) => a.status === "Open");
    } catch (e) {
      alerts = [];
    }

    return {
      props: {
        products,
        warehouses,
        stock,
        alerts,
      },
    };
  } catch (error) {
    console.error("Error loading dashboard data on server:", error);

    return {
      props: {
        products: [],
        warehouses: [],
        stock: [],
        alerts: [],
        error: "Failed to load dashboard data. Please try again later.",
      },
    };
  }
};
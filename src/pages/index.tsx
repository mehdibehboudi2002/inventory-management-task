import {
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Skeleton,
  Alert,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import ListTable from "@/components/ui/ListTable";
import { DataTableColumn } from "@/types/inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CategoryIcon from "@mui/icons-material/Category";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
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
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import DashboardChartPanel from "@/components/dashboard/DashboardChartPanel";

// Define the Inventory Item type based on the data displayed in the dashboard table
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  totalQuantity: number;
  reorderPoint: number;
  status: string;
  // Assuming statusColor is a recognized Material UI color variant for Chip
  statusColor: "error" | "warning" | "success" | "primary" | "secondary" | "info" | undefined;
}

// Define Eco-Friendly Theme Colors
const GREEN_MAIN = "#2e7d32";
const EARTH_BROWN = "#795548";
const BLUE_ACCENT = "#0288d1";
const CHART_COLORS = [GREEN_MAIN, "#66bb6a", EARTH_BROWN, BLUE_ACCENT]; // Primary chart colors

// Component for Skeleton Placeholder (Uses Card/CardContent for styling consistency)
const DashboardSkeleton = () => (
  <Grid container spacing={3} sx={{ mt: 4 }}>
    {[...Array(4)].map((_, i) => (
      <Grid item xs={12} sm={6} md={3} key={i}>
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "20px" }} />
      </Grid>
    ))}
    <Grid item xs={12} md={6}>
      <Skeleton variant="rectangular" height={350} sx={{ borderRadius: "20px" }} />
    </Grid>
    <Grid item xs={12} md={6}>
      <Skeleton variant="rectangular" height={350} sx={{ borderRadius: "20px" }} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "20px" }} />
    </Grid>
  </Grid>
);

export default function Home() {
  const {
    products,
    warehouses,
    inventoryOverview, // Data to be used in ListTable
    totalValue,
    lowStockCount,
    warehouseData,
    categoryData,
    stockStatusData,
    loading,
    error,
  } = useDashboardData();

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
          // Type assertion is safe here as statusColor is defined in InventoryItem
          color={row.statusColor as "error" | "warning" | "success"}
          size="small"
          sx={{ fontWeight: 600, fontSize: "0.75rem" }}
        />
      ),
    },
  ];

  if (loading) {
    // Loading display
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ color: GREEN_MAIN, fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          <DashboardSkeleton />
        </Container>
      </Layout>
    );
  }

  if (error) {
    // Error display
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Typography variant="h5" color="textSecondary">
            Please refresh the page or check the network connection.
          </Typography>
        </Container>
      </Layout>
    );
  }

  // --- Conditional styles for Low Stock Alert Card ---
  const lowStockGradient = lowStockCount > 0
    ? "linear-gradient(135deg, #f57c00 0%, #ffab2cff 100%)" // Orange/Warning
    : "linear-gradient(135deg, #14A44D 0%, #5ad78cff 100%)"; // Green/Success

  const iconSx = { fontSize: { xs: 30, sm: 40 }, opacity: 0.9 };

  // --- Main Dashboard Render ---
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

        {/* Statistics Cards - NOW USING DashboardStatCard */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          {/* Card 1: Total Products */}
          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Total Products"
              value={products.length}
              icon={<CategoryIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #805b50ff 0%, #a3887dff 100%)"
            />
          </Grid>

          {/* Card 2: Active Warehouses */}
          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Active Warehouses"
              value={warehouses.length}
              icon={<WarehouseIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #2e7d32 0%, #5bb25eff 100%)"
            />
          </Grid>

          {/* Card 3: Inventory Value */}
          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Inventory Value"
              value={`$${totalValue.toFixed(0)}`}
              icon={<AttachMoneyIcon sx={iconSx} />}
              backgroundGradient="linear-gradient(135deg, #855a4dff 0%, #a48578ff 100%)"
            />
          </Grid>

          {/* Card 4: Low Stock Alerts (Conditional Gradient) */}
          <Grid item xs={6} sm={6} md={3}>
            <DashboardStatCard
              title="Low Stock Alerts"
              value={lowStockCount}
              icon={<WarningAmberIcon sx={iconSx} />}
              backgroundGradient={lowStockGradient}
            />
          </Grid>
        </Grid>

        {/* Charts Section - NOW USING DashboardChartPanel */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          sx={{ mb: { xs: 3, md: 4 } }}
        >
          {/* Inventory by Warehouse (Bar Chart) */}
          <Grid item xs={12} md={6}>
            <DashboardChartPanel title="Inventory Value by Warehouse">
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
                  <Bar
                    dataKey="value"
                    fill={GREEN_MAIN}
                    name="Value ($)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </DashboardChartPanel>
          </Grid>

          {/* Products by Category (Pie Chart) */}
          <Grid item xs={12} md={6}>
            <DashboardChartPanel title="Inventory by Category">
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
                    outerRadius={100} // Simplified to a single value
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
            </DashboardChartPanel>
          </Grid>

          {/* Stock Status Distribution (Horizontal Bar Chart) */}
          <Grid item xs={12}>
            <DashboardChartPanel title="Stock Status Distribution" isFullWidth={true}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockStatusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100} // Simplified width
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="value" name="Products" fill={GREEN_MAIN}>
                    {stockStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </DashboardChartPanel>
          </Grid>
        </Grid>

        {/* ListTable Component for Inventory Overview (Remains the same) */}
        <Paper sx={{ p: { xs: 1, sm: 3 }, borderRadius: "20px" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: GREEN_MAIN, fontWeight: 600 }}
          >
            Inventory Overview
          </Typography>
          <ListTable<InventoryItem>
            data={inventoryOverview as InventoryItem[]} // Cast to the defined interface
            columns={inventoryColumns}
            loading={loading} // Inherit loading state from the dashboard hook
            emptyMessage="No inventory items found."
          // Action button intentionally omitted as this is a dashboard view
          />
        </Paper>
      </Container>
    </Layout>
  );
}
